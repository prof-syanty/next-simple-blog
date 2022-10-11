// src/pages/_app.tsx
import "@styles/globals.css";
import { trpc } from "@utils/trpc";
import type { Session } from "next-auth";
import { SessionProvider, signIn, signOut, useSession } from "next-auth/react";
import type { AppProps } from "next/app";
interface AppPropsWithLayout extends AppProps {
  pageProps: {
    session: Session;
  };
}
const MyApp = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppPropsWithLayout) => {
  return (
    <SessionProvider session={session}>
      <div className="flex flex-col w-full">
        <header className="flex items-center justify-between p-3 shadow-lg bg-slate-50">
          <h1>LOGO</h1>
          <AuthShowcase />
        </header>
        <main className="min-h-screen">
          <Component {...pageProps} />
        </main>
      </div>
    </SessionProvider>
  );
};

export default trpc.withTRPC(MyApp);

const AuthShowcase: React.FC = () => {
  const { data: sessionData } = useSession();

  return (
    <div className="flex items-center justify-center gap-2">
      {sessionData && (
        <p className="text-2xl text-blue-500">
          Logged in as {sessionData?.user?.name}
        </p>
      )}
      <button
        className="px-4 py-2 border border-black text-xl rounded-md bg-violet-50 hover:bg-violet-100 shadow-lg'"
        onClick={sessionData ? () => signOut() : () => signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
};
