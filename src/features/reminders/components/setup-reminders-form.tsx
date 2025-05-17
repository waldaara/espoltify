"use client";

import { ClockAlertIcon, LoaderIcon, TrashIcon, User2Icon } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { TypographyH1, TypographyP } from "@/shared/components/ui/typography";
import { cn } from "@/shared/utils/cn";

import { useSetupRemindersForm } from "@/features/reminders/hooks/use-setup-reminders-form";

export function SetupRemindersForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const {
    form,
    onSubmit,
    isPending,
    reminderTimeInHoursFields,
    appendReminderTimeInHoursField,
    removeReminderTimeInHoursField,
  } = useSetupRemindersForm();

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="border-none bg-background shadow-none">
        <CardHeader className="text-center">
          <CardTitle>
            <TypographyH1>Setup Reminders</TypographyH1>
          </CardTitle>

          <CardDescription>
            <TypographyP className="leading-normal">
              Here you can setup your reminders.
            </TypographyP>
          </CardDescription>
        </CardHeader>

        <CardContent className="grid gap-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="token"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Token</FormLabel>

                    <div className="relative">
                      <FormControl>
                        <Input
                          className="peer ps-9 not-aria-invalid:border-none shadow-none aria-invalid:text-destructive-foreground"
                          disabled={isPending}
                          {...field}
                        />
                      </FormControl>

                      <div
                        className={cn(
                          "text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50",
                          fieldState.invalid && "text-destructive-foreground",
                          fieldState.isDirty &&
                            !fieldState.invalid &&
                            "text-foreground"
                        )}
                      >
                        <User2Icon size={16} aria-hidden="true" />
                      </div>
                    </div>

                    <FormDescription>
                      This token should be generate by you in Aula Virtual.
                    </FormDescription>

                    <FormMessage />
                  </FormItem>
                )}
              />

              {reminderTimeInHoursFields.map((field, index) => (
                <FormField
                  control={form.control}
                  key={field.id}
                  name={`reminderTimeBeforeDeadlineInHours.${index}.value`}
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel className={cn(index !== 0 && "sr-only")}>
                        Reminders in hours
                      </FormLabel>

                      <div className="relative flex items-center gap-2">
                        <FormControl>
                          <Input
                            className="peer ps-9 not-aria-invalid:border-none shadow-none aria-invalid:text-destructive-foreground"
                            disabled={isPending}
                            type="number"
                            min={1}
                            max={24}
                            {...field}
                          />
                        </FormControl>

                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="rounded-full"
                          onClick={() => removeReminderTimeInHoursField(index)}
                        >
                          <TrashIcon size={16} aria-hidden="true" />
                        </Button>

                        <div
                          className={cn(
                            "text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50",
                            fieldState.invalid && "text-destructive-foreground",
                            fieldState.isDirty &&
                              !fieldState.invalid &&
                              "text-foreground"
                          )}
                        >
                          <ClockAlertIcon size={16} aria-hidden="true" />
                        </div>
                      </div>

                      <FormDescription>
                        The reminder will be sent {field.value} hour(s) before
                        the deadline of your assignment.
                      </FormDescription>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}

              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => appendReminderTimeInHoursField({ value: 1 })}
              >
                Add reminder
              </Button>

              <Button disabled={isPending} type="submit" className="w-full">
                {isPending && <LoaderIcon className="animate-spin" />}
                Setup reminders
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
