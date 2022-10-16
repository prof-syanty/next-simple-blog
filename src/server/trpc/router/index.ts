// src/server/trpc/router/index.ts
import { authRouter } from "@server/trpc/router/auth";
import { commentRouter } from "@server/trpc/router/comment";
import { exampleRouter } from "@server/trpc/router/example";
import { postRouter } from "@server/trpc/router/post";
import { userRouter } from "@server/trpc/router/user";
import { t } from "@server/trpc/trpc";

export const appRouter = t.router({
  example: exampleRouter,
  auth: authRouter,
  post: postRouter,
  user: userRouter,
  comment: commentRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
