"use server";

import { headers } from "next/headers";
import { eq } from "drizzle-orm";
import { auth } from "@/shared/lib/better-auth/server";
import { db } from "@/shared/lib/drizzle/server";
import type { ActionResponse } from "@/shared/types";
import { tryCatch } from "@/shared/utils/try-catch";
import { reminder } from "@/shared/lib/drizzle/schema";

type ErrorCode = "UNAUTHORIZED" | "NOT_FOUND";

type Reminder = typeof reminder.$inferSelect;

export const getReminder = async (): Promise<
  ActionResponse<Reminder, ErrorCode>
> => {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return {
      error: {
        code: "UNAUTHORIZED",
        message: "Unauthorized",
      },
    };
  }

  const { data } = await tryCatch(
    db.select().from(reminder).where(eq(reminder.userId, session.user.id))
  );

  if (!data || data?.length === 0) {
    return {
      error: {
        code: "NOT_FOUND",
        message: "No reminder found, please setup a reminder",
      },
    };
  }

  return {
    data: data[0],
  };
};
