import type { RoleKey } from "@/lib/permissions";

declare module "next-auth" {
  interface User {
    role: RoleKey;
  }

  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: RoleKey;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: RoleKey;
    id: string;
  }
}
