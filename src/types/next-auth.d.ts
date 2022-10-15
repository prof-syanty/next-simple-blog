import { Role } from "@enum";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user?: {
      id: string;
      role: Role;
    } & DefaultSession["user"];
  }
}
/** Example on how to extend the built-in types for JWT */
declare module "next-auth/jwt" {
  // eslint-disable-next-line no-unused-vars
  interface JWT {
    /** This is an example. You can find me in types/next-auth.d.ts */
    userId: string;
    userRole: Role;
  }
}
