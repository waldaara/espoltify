import { useMutation } from "@tanstack/react-query";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

import { saveReminder } from "@/features/reminders/actions/save-reminder";
import type { SetupRemindersFormValues } from "@/features/reminders/types";

interface Props {
  form: UseFormReturn<SetupRemindersFormValues>;
}

export const useSaveReminderMutation = ({}: Props) => {
  return useMutation({
    mutationFn: async (values: SetupRemindersFormValues) => {
      const { error } = await saveReminder(values);

      if (error) return Promise.reject(error);
    },
    onSuccess: () => {
      toast.success("Reminder saved successfully 🎉");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
