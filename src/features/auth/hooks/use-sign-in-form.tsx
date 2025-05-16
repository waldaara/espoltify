"use client";

import { useSignInSocialMutation } from "@/features/auth/hooks/use-sign-in-social-mutation";

export const useSignInForm = () => {
  const { mutate, isPending } = useSignInSocialMutation();

  const handleSignInWithGoogle = () => mutate({ provider: "google" });

  return {
    isPending,
    handleSignInWithGoogle,
  };
};

