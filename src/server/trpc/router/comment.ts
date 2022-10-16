import { postCommentSchema } from "@schema/comment.schema";
import { singlePostSchema } from "@schema/post.schema";
import { authedProcedure, t } from "@server/trpc/trpc";

export const commentRouter = t.router({
  getAllCommentsByPostId: t.procedure
    .input(singlePostSchema)
    .query(async ({ input, ctx }) => {
      try {
        const comments = await ctx.prisma.comment.findMany({
          where: {
            postId: input.id,
          },
          orderBy: {
            createdAt: "desc",
          },
          include: {
            commentedBy: true,
            commentedPost: true,
            parent: true,
            children: true,
          },
        });

        return comments;
      } catch (error) {}
    }),

  addPostComment: authedProcedure
    .input(postCommentSchema)
    .mutation(({ ctx, input }) => {
      try {
        const comment = ctx.prisma.comment.create({
          data: {
            body: input.body,
            commentedBy: {
              connect: {
                id: ctx.session.user.id,
              },
            },
            commentedPost: {
              connect: {
                id: input.postId,
              },
            },
            ...(input.parentId && {
              parent: {
                connect: {
                  id: input.parentId,
                },
              },
            }),
          },
        });

        return comment;
      } catch (error) {}
    }),
});
