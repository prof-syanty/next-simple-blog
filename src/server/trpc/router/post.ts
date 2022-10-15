import {
  changePublishStatusSchema,
  createUpdatePostSchema,
  offsetPostsPayloadSchema,
  singlePostSchema,
} from "@schema/post.schema";
import { authedProcedure, t } from "@server/trpc/trpc";

export const postRouter = t.router({
  getAllPosts: t.procedure.query(({ ctx }) => {
    return ctx.prisma.post.findMany({
      where: {
        isPublished: true,
      },
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
            isPublished: false, //for admin to publish
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

  offsetPosts: t.procedure
    .input(offsetPostsPayloadSchema)
    .query(async ({ input, ctx }) => {
      const limit = input.limit ?? 12;
      const page = input.page ?? 1;

      const searchTerm = input.searchTerm;
      const searchTermFilter = searchTerm
        ? {
            OR: [
              { title: { contains: searchTerm } },
              { body: { contains: searchTerm } },
            ],
          }
        : {};

      const postsCount = await ctx.prisma.post.count({
        where: { ...searchTermFilter },
      });
      const posts = await ctx.prisma.post.findMany({
        take: limit,
        skip: limit * (page - 1),
        where: { ...searchTermFilter },
        orderBy: {
          createdAt: "asc",
        },
        include: {
          author: true,
        },
      });
      const totalPages = Math.ceil(postsCount / limit);
      return {
        results: posts,
        meta: {
          totalItems: postsCount,
          totalPages,
          currentPage: page,
          perPage: limit,
          prevPage: page > 1 ? page - 1 : null,
          nextPage: page < totalPages ? page + 1 : null,
        },
      };
    }),

  changePublishStatus: authedProcedure
    .input(changePublishStatusSchema)
    .mutation(({ input, ctx }) => {
      const updatedPost = ctx.prisma.post.update({
        where: {
          id: input.id,
        },
        data: {
          isPublished: !input.isPublished, //toggle publish status
        },
      });

      return updatedPost;
    }),
});
