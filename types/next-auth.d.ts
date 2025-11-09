import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user?: DefaultSession["user"] & {
      id: string;
      role: "BETTOR" | "CAPPER" | "ADMIN";
      isVerified: boolean;
    };
  }

  interface User {
    role: "BETTOR" | "CAPPER" | "ADMIN";
    isVerified: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: "BETTOR" | "CAPPER" | "ADMIN";
    isVerified?: boolean;
  }
}
