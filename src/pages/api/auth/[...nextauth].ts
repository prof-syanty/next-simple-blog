import NextAuth, { type NextAuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import FacebookProvider from "next-auth/providers/facebook";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
// Prisma adapter for NextAuth, optional and can be removed
import { env } from "@env/server.mjs";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@server/db/client";
import { comparePassword } from "@utils/bcryptjs";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  callbacks: {
    session: async ({ session, token }) => {
      if (session?.user) {
        session.user.id = token.userId;
        session.user.role = token.userRole;
      }
      return session;
    },
    jwt: async ({ user, token }) => {
      if (user) {
        token.userId = user.id;
        token.userRole = user.role;
      }
      return token;
    },
  },
  session: {
    strategy: "jwt",
  },
  // Configure one or more authentication providers
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "Enter your email",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Enter your password",
        },
      },
      authorize: async (credentials) => {
        const { email, password } = { ...credentials };
        const user = await prisma.user.findUnique({
          where: {
            email,
          },
        });
        if (
          user &&
          (await comparePassword(password as string, user.password as string))
        ) {
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            image: "",
            role: user.role,
          };
        }
        throw new Error("Invalid credentials");
      },
    }),
    FacebookProvider({
      clientId: env.FACEBOOK_CLIENT_ID,
      clientSecret: env.FACEBOOK_CLIENT_SECRET,
    }),
    GitHubProvider({
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    }),
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
    DiscordProvider({
      clientId: env.DISCORD_CLIENT_ID,
      clientSecret: env.DISCORD_CLIENT_SECRET,
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
};

export default NextAuth(authOptions);
