import { Role } from "@prisma/client";
import {
  changePublishStatusSchema,
  createUpdatePostSchema,
  offsetPostsPayloadSchema,
  postLikeUnlikeSchema,
  singlePostSchema,
} from "@schema/post.schema";
import { adminProcedure, authedProcedure, t } from "@server/trpc/trpc";
import { TRPCError } from "@trpc/server";

export const postRouter = t.router({
  getAllPosts: t.procedure.query(async ({ ctx }) => {
    return await ctx.prisma.post.findMany({
      where: {
        isPublished: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        author: true,
        likedBy: true,
        comments: true,
      },
    });
  }),
  createUpdatePost: authedProcedure
    .input(createUpdatePostSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        if (input.id) {
          const authorPostsCount = await ctx.prisma.post.count({
            where: {
              id: input.id,
              authorId: ctx.session.user.id,
              isPublished: true,
            },
          });

          if (!authorPostsCount) {
            throw new TRPCError({ code: "NOT_FOUND" });
          }
        }

        await ctx.prisma.post.upsert({
          where: {
            id: input.id || "",
          },
          update: {
            ...input,
            isPublished: ctx.session.user.role === Role.ADMIN ? true : false, //for admin to publish
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
      } catch (errors) {}

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

  changePublishStatus: adminProcedure
    .input(changePublishStatusSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const updatedPost = await ctx.prisma.post.update({
          where: {
            id: input.id,
          },
          data: {
            isPublished: !input.isPublished, //toggle publish status
          },
        });

        return updatedPost;
      } catch (error) {}
    }),

  getAuthorPosts: authedProcedure.query(async ({ ctx }) => {
    try {
      const posts = await ctx.prisma.post.findMany({
        where: {
          authorId: ctx.session.user.id,
        },
        include: {
          author: true,
        },
      });

      return posts;
    } catch (error) {}
  }),
  getAuthorUnpublishedPostsCount: authedProcedure.query(async ({ ctx }) => {
    try {
      const postsCount = await ctx.prisma.post.count({
        where: {
          authorId: ctx.session.user.id,
          isPublished: false,
        },
      });

      return postsCount;
    } catch (error) {}
  }),

  likeUnlikePost: authedProcedure
    .input(postLikeUnlikeSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const updatedPost = await ctx.prisma.post.update({
          where: {
            id: input.id,
          },
          data: {
            likedBy: input.like
              ? {
                  connect: {
                    id: ctx.session.user.id,
                  },
                }
              : {
                  disconnect: {
                    id: ctx.session.user.id,
                  },
                },
          },
        });

        return updatedPost;
      } catch (error) {}
    }),
});
