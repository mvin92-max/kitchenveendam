import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validation/auth";
import type { RoleKey } from "@/lib/permissions";
import { authConfig } from "@/lib/auth.config";

/**
 * Full Auth.js (NextAuth v5) configuration — Node.js runtime only (it needs
 * Prisma + bcrypt). Used by the API route handler and anywhere server
 * components call `auth()`. `middleware.ts` uses the edge-safe
 * `auth.config.ts` instead; see the comment there for why.
 *
 * Credentials-only for now (staff log in with email + password seeded by
 * `prisma/seed.ts`). JWT session strategy is required for the Credentials
 * provider — there is no server-side session row to look up, so the user's
 * id/role are embedded in the signed token instead.
 *
 * A `PrismaAdapter` is intentionally NOT wired in here: it's only needed for
 * OAuth account linking, which this phase doesn't use. Add it back if/when a
 * "sign in with Google" option is introduced for the Gast role.
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: "E-mail", type: "email" },
        password: { label: "Wachtwoord", type: "password" },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const user = await prisma.user.findUnique({
          where: { email: parsed.data.email },
          include: { role: true },
        });
        if (!user || !user.active) return null;

        const passwordValid = await bcrypt.compare(parsed.data.password, user.passwordHash);
        if (!passwordValid) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role.key as RoleKey,
        };
      },
    }),
  ],
});
