"use client";

import { UserRoundPenIcon } from "lucide-react";

import { SettingsNavLink } from "@/features/settings/components/settings-nav-link";
import { useSettingsInMobile } from "@/features/settings/hooks/use-settings-in-mobile";

const items = [
  {
    label: "Account",
    href: "/settings/account",
    icon: <UserRoundPenIcon />,
  },
];

export function SettingsSidebar() {
  const { isMobile, isMounted, isSettingsPage } = useSettingsInMobile();

  if (!isMounted) return null;

  if (isMobile && !isSettingsPage) return null;

  return (
    <aside className="w-full md:w-max h-full">
      <nav className="flex flex-col gap-2">
        {items.map((item) => (
          <SettingsNavLink
            key={item.href}
            href={item.href}
            additionalMatches={
              !isMobile && item.href === "/settings/account"
                ? ["/settings"]
                : undefined
            }
            label={item.label}
            icon={item.icon}
            includeArrow
            exactMatch
          />
        ))}
      </nav>
    </aside>
  );
}

