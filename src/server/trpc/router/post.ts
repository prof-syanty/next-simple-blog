import { createUpdatePostSchema, singlePostSchema } from "@schema/post.schema";
import { authedProcedure, t } from "@server/trpc/trpc";

export const postRouter = t.router({
  getAllPosts: t.procedure.query(({ ctx }) => {
    return ctx.prisma.post.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        author: true,
      },
    });
  }),
  createUpdatePost: authedProcedure
    .input(createUpdatePostSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.post.upsert({
          where: {
            id: input.id || "",
          },
          update: {
            ...input,
          },
          create: {
            ...input,
            author: {
              connect: {
                id: ctx.session?.user.id,
              },
            },
          },
        });
        return {
          message: "Post upserted successfully",
        };
      } catch (errors) {
        console.log(errors);
      }

      return;
    }),
  getSinglePost: t.procedure.input(singlePostSchema).query(({ input, ctx }) => {
    try {
      const post = ctx.prisma.post.findUnique({
        where: {
          id: input.id,
        },
        include: {
          author: true,
        },
      });

      return post;
    } catch (error) {}
  }),

  deletePost: authedProcedure
    .input(singlePostSchema)
    .mutation(({ input, ctx }) => {
      try {
        const deletedPost = ctx.prisma.post.delete({
          where: {
            id: input.id,
          },
        });

        return deletedPost;
      } catch (error) {}
    }),
});
