import { createPostSchema } from "@schema/post.schema";
import { authedProcedure, t } from "@server/trpc/trpc";

export const postRouter = t.router({
  getAllPosts: t.procedure.query(({ ctx }) => {
    return ctx.prisma.post.findMany({
      include: {
        author: true,
      },
    });
  }),
  createPost: authedProcedure
    .input(createPostSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.post.create({
          data: {
            ...input,
            author: {
              connect: {
                id: ctx.session?.user.id,
                email: ctx.session?.user.email as string,
              },
            },
          },
        });
        return {
          message: "Post created successfully",
        };
      } catch (errors) {
        console.log(errors);
      }

      return;
    }),
});
