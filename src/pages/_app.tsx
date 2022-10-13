// src/pages/_app.tsx
import "@styles/globals.css";
import { trpc } from "@utils/trpc";
import type { Session } from "next-auth";
import { SessionProvider, signIn, signOut, useSession } from "next-auth/react";
import type { AppProps } from "next/app";
import Link from "next/link";
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
        <header className="flex items-center justify-between p-3 shadow-lg bg-slate-50 sticky top-0 px-16">
          <Link href={"/"}>
            <a className="text-3xl font-bold">LOGO</a>
          </Link>
          <AuthShowcase />
        </header>
        <main className="min-h-screen my-4 mx-16">
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
        <p>
          <span className="mr-2">Welcome</span>
          <Link href={"/profile"}>
            <a className="text-green-500 hover:underline">
              {sessionData?.user?.name}
            </a>
          </Link>
        </p>
      )}
      <button
        className="px-4 py-1 border border-red-900 text-xl rounded-md bg-red-50 hover:bg-red-300 shadow-lg'"
        onClick={sessionData ? () => signOut() : () => signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
};
