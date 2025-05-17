import type { Metadata } from "next";
import Link from "next/link";

import { ThemeSwitch } from "@/shared/components/theme-switch";

export const metadata: Metadata = {
  title: "Espolify",
  description: "Fuck it, we ball",
};

export default function Home() {
  return (
    <main>
      <ThemeSwitch />
      bla bla bla bla bla
      <Link href="/sign-in">Sign in</Link>
    </main>
  );
}

