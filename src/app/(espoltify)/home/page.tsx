import type { Metadata } from "next";

import { SetupRemindersForm } from "@/features/reminders/components/setup-reminders-form";

export const metadata: Metadata = {
  title: "Espolify | Home",
};

export default function HomePage() {
  return (
    <main className="flex flex-col gap-6">
      <SetupRemindersForm />
    </main>
  );
}

