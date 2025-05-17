import { authClient } from "@/shared/lib/better-auth/client";
import { user } from "@/shared/lib/drizzle/schema";

export type Session = typeof authClient.$Infer.Session;
export interface AuthClientError {
  code?: string | undefined;
  message?: string | undefined;
  status: number;
  statusText: string;
}

export type ActionResponse<T, E extends string> = {
  data?: T;
  error?: {
    code: E;
    message: string;
  };
};

export type User = typeof user.$inferSelect;

