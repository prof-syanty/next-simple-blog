// src/pages/_app.tsx
import "@styles/globals.css";
import { trpc } from "@utils/trpc";
import type { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import type { AppType } from "next/app";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
};

export default trpc.withTRPC(MyApp);
