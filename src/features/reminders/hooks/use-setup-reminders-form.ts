import { useQuery } from "@tanstack/react-query";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { getReminder } from "@/features/reminders/actions/get-reminder";
import { useSaveReminderMutation } from "@/features/reminders/hooks/use-save-reminder-mutation";
import { setupRemindersFormSchema } from "@/features/reminders/schema/setup-reminders-form-schema";
import type { SetupRemindersFormValues } from "@/features/reminders/types";

export const useSetupRemindersForm = () => {
  const { data: reminder } = useQuery({
    queryKey: ["reminder"],
    queryFn: async () => {
      const { data, error } = await getReminder();

      if (error) throw new Error(error.message);

      return data;
    },
  });

  const form = useForm<SetupRemindersFormValues>({
    resolver: zodResolver(setupRemindersFormSchema),
    values: {
      token: reminder?.token ?? "",
      reminderTimeBeforeDeadlineInHours:
        reminder?.reminderTimeBeforeDeadlineInHours.map((hours) => ({
          value: hours,
        })) ?? [{ value: 1 }],
    },
  });

  const {
    fields: reminderTimeInHoursFields,
    append: appendReminderTimeInHoursField,
    remove: removeReminderTimeInHoursField,
  } = useFieldArray({
    name: "reminderTimeBeforeDeadlineInHours",
    control: form.control,
  });

  const { mutate, isPending } = useSaveReminderMutation({
    form,
  });

  const onSubmit = (values: SetupRemindersFormValues) => mutate(values);

  return {
    form,
    onSubmit,
    isPending,
    reminderTimeInHoursFields,
    appendReminderTimeInHoursField,
    removeReminderTimeInHoursField,
  };
};
