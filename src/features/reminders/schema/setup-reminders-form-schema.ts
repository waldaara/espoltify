import { z } from "zod";

export const setupRemindersFormSchema = z.object({
  token: z.string().min(1),
  reminderTimeBeforeDeadlineInHours: z.array(
    z.object({
      value: z
        .number({
          coerce: true,
        })
        .min(1)
        .max(24),
    })
  ),
});
