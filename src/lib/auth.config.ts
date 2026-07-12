import type { NextAuthConfig } from "next-auth";
import type { RoleKey } from "@/lib/permissions";

/**
 * Edge-safe slice of the Auth.js config (no Prisma/bcrypt imports, which
 * depend on the `better-sqlite3` native addon and cannot run in the Edge
 * runtime that `middleware.ts` executes in).
 *
 * `src/lib/auth.ts` extends this with the actual Credentials provider for
 * use in Node.js contexts (route handlers, server components/layouts).
 * `middleware.ts` uses this file directly, with an empty provider list,
 * purely to decode/verify the existing session JWT.
 */
export const authConfig = {
  pages: { signIn: "/login" },
  session: { strategy: "jwt", maxAge: 60 * 60 * 8 },
  providers: [],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.role = (user as { role: RoleKey }).role;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id as string;
      session.user.role = token.role as RoleKey;
      return session;
    },
  },
} satisfies NextAuthConfig;
