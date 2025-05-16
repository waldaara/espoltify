import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";

import { BASE_URL } from "@/shared/constants";
import { db } from "@/shared/lib/drizzle/server";
import { redis } from "@/shared/lib/upstash/redis";

export const auth = betterAuth({
  appName: "Espolify",
  baseURL: BASE_URL,
  //TODO
  trustedOrigins: ["http://192.168.0.113:3000"],
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  secondaryStorage: {
    get: async (key) => {
      const value = await redis.get<string>(key);
      return value ? value : null;
    },
    set: async (key, value, ttl) => {
      if (ttl) await redis.set(key, value, { ex: ttl });
      else await redis.set(key, value);
    },
    delete: async (key) => {
      await redis.del(key);
    },
  },
  rateLimit: {
    storage: "secondary-storage",
  },
  advanced: {
    cookiePrefix: "espoltify",
  },
  plugins: [nextCookies()],
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      mapProfileToUser: (profile) => {
        return {
          displayUsername: profile.email.split("@")[0],
        };
      },
    },
  },
});

