import { useMemo } from "react";
import { HomeIcon, SettingsIcon } from "lucide-react";

import { useSession } from "@/shared/hooks/use-session";

export const useAppSidebar = () => {
  const {
    data: session,
    isSuccess: isSessionSuccess,
    isLoading: isSessionLoading,
    isError: isSessionError,
    refetch: refetchSession,
    isRefetching: isSessionRefetching,
  } = useSession();

  const links = useMemo(
    () => [
      { href: "/home", label: "Home", icon: <HomeIcon /> },
      {
        href: "/settings",
        label: "Settings",
        icon: <SettingsIcon />,
      },
    ],
    []
  );

  return {
    links,
    session,
    isSessionSuccess,
    isSessionLoading,
    isSessionError,
    refetchSession,
    isSessionRefetching,
  };
};

