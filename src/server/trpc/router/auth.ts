import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { userSignUpSchema } from "@schema/user.schema";
import { authedProcedure, t } from "@server/trpc/trpc";
import * as trpc from "@trpc/server";
import { hashPassword } from "@utils/bcryptjs";

export const authRouter = t.router({
  getSession: t.procedure.query(({ ctx }) => {
    return ctx.session;
  }),
  getSecretMessage: authedProcedure.query(() => {
    return "You are logged in and can see this secret message!";
  }),
  signup: t.procedure
    .input(userSignUpSchema)
    .mutation(async ({ input, ctx }) => {
      const { email, name, password } = input;
      try {
        const user = await ctx.prisma.user.create({
          data: {
            email,
            name,
            password: await hashPassword(password),
          },
        });

        return user;
      } catch (e) {
        if (e instanceof PrismaClientKnownRequestError) {
          if (e.code === "P2002") {
            throw new trpc.TRPCError({
              code: "CONFLICT",
              message: "User already exists",
            });
          }
        }

        throw new trpc.TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
        });
      }
    }),
});
