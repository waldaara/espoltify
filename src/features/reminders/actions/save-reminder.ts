"use server";

import { headers } from "next/headers";
import { calendar_v3, Auth } from "googleapis";

import { eq } from "drizzle-orm";
import { auth } from "@/shared/lib/better-auth/server";
import { db } from "@/shared/lib/drizzle/server";
import { account, reminder } from "@/shared/lib/drizzle/schema";
import type { ActionResponse } from "@/shared/types";
import { tryCatch } from "@/shared/utils/try-catch";

import type {
  Assignment,
  SetupRemindersFormValues,
} from "@/features/reminders/types";

type ErrorCode =
  | "UNAUTHORIZED"
  | "DB_ERROR"
  | "FETCH_ERROR"
  | "GOOGLE_ERROR"
  | "PARSE_ERROR";

export const saveReminder = async (
  values: SetupRemindersFormValues
): Promise<ActionResponse<undefined, ErrorCode>> => {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return { error: { code: "UNAUTHORIZED", message: "Unauthorized" } };
  }

  const { error: insertError } = await tryCatch(
    db
      .insert(reminder)
      .values({
        token: values.token,
        reminderTimeBeforeDeadlineInHours:
          values.reminderTimeBeforeDeadlineInHours.map(({ value }) => value),
        userId: session.user.id,
      })
      .onConflictDoUpdate({
        target: reminder.userId,
        set: {
          token: values.token,
          reminderTimeBeforeDeadlineInHours:
            values.reminderTimeBeforeDeadlineInHours.map(({ value }) => value),
        },
      })
  );

  if (insertError) {
    console.error(insertError);

    return {
      error: {
        code: "DB_ERROR",
        message: "Failed to save reminder",
      },
    };
  }

  const { data: accountData } = await tryCatch(
    db.select().from(account).where(eq(account.userId, session.user.id))
  );

  if (!accountData) {
    return {
      error: { code: "DB_ERROR", message: "Failed to get account data" },
    };
  }

  const { data: assignmentsResponse, error: fetchError } = await tryCatch(
    fetch(
      `https://aulavirtual.espol.edu.ec/api/v1/planner/items?start_date=${new Date().toISOString()}`,
      {
        headers: {
          Authorization: `Bearer ${values.token}`,
        },
      }
    )
  );

  if (fetchError || !assignmentsResponse.ok) {
    console.error(fetchError);

    return {
      error: { code: "FETCH_ERROR", message: "Failed to fetch assignments" },
    };
  }

  const { data: assignments, error: parseError } = await tryCatch(
    assignmentsResponse.json() as Promise<Assignment[]>
  );

  if (parseError) {
    console.error(parseError);

    return {
      error: { code: "PARSE_ERROR", message: "Failed to parse assignments" },
    };
  }

  const oauth2Client = new Auth.OAuth2Client({
    credentials: {
      access_token: accountData[0].accessToken,
      refresh_token: accountData[0].refreshToken,
    },
  });

  const calendar = new calendar_v3.Calendar({
    auth: oauth2Client,
  });

  for (const assignment of assignments) {
    for (const {
      value: hoursBeforeDeadline,
    } of values.reminderTimeBeforeDeadlineInHours) {
      const dueDate = new Date(assignment.plannable_date);

      const startReminderEventDate = new Date(dueDate);
      startReminderEventDate.setHours(
        startReminderEventDate.getHours() - hoursBeforeDeadline
      );

      const endReminderEventDate = new Date(startReminderEventDate);

      const { error: eventError } = await tryCatch(
        calendar.events.insert({
          calendarId: session.user.email,
          requestBody: {
            summary: assignment.context_name,
            description: assignment.plannable.title,
            start: {
              dateTime: startReminderEventDate.toISOString(),
            },
            end: {
              dateTime: endReminderEventDate.toISOString(),
            },
            reminders: {
              useDefault: false,
              overrides: [
                {
                  method: "popup",
                  minutes: 0,
                },
              ],
            },
          },
        })
      );

      if (eventError) {
        console.error(eventError);

        return {
          error: {
            code: "GOOGLE_ERROR",
            message: "Failed to create calendar event",
          },
        };
      }
    }
  }

  return { data: undefined };
};
