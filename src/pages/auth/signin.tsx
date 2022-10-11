import { userLoginInput } from "@schema/user.schema";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import {
  getCsrfToken,
  getProviders,
  signIn,
  useSession,
} from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const SignIn = ({
  csrfToken,
  providers,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { data: session } = useSession();
  const router = useRouter();
  useEffect(() => {
    if (session) {
      router.push("/");
    }
  }, [router, session]);
  const [error, setError] = useState("");
  const { handleSubmit, register } = useForm<userLoginInput>();
  const submitHandler = ({ email, password }: userLoginInput) =>
    signIn("credentials", {
      redirect: false,
      email,
      password,
    }).then((res) => {
      if (res?.error) {
        setError(res.error);
      } else {
        setError("");
      }

      if (res?.status === 200) {
        router.push("/");
      }
    });

  return (
    <div className="w-full flex justify-center">
      <div className="max-w-sm">
        <h1 className="text-3xl font-bold text-center py-3">LOGIN FORM</h1>
        {error && (
          <div className="text-center text-red-500 bg-red-50 p-2 mb-2">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit(submitHandler)}>
          <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
          <div className="flex flex-col space-y-3 border  p-6">
            <div className="flex flex-col space-y-2">
              <label htmlFor="email">Email</label>
              <input {...register("email")} type="email" />
            </div>
            <div className="flex flex-col space-y-2">
              <label htmlFor="password">Password</label>
              <input {...register("password")} type="password" />
            </div>
            <div>
              <button
                type="submit"
                className="bg-gray-300 p-2 w-full rounded-md hover:bg-gray-400"
              >
                Sign in with Credentials
              </button>
              <Link href="/auth/register">
                <a className="block text-center p-2 text-blue-600 hover:underline">
                  Not a User?
                </a>
              </Link>
            </div>

            {providers && (
              <>
                <p className="text-center">or</p>
                {Object.values(providers).map(
                  (provider) =>
                    provider.name !== "credentials" && (
                      <div key={provider.name}>
                        <button
                          type="button"
                          className="bg-gray-300 p-2 w-full rounded-md hover:bg-gray-400"
                          onClick={() =>
                            signIn(provider.id, {
                              callbackUrl: "/",
                            })
                          }
                        >
                          Sign in with {provider.name}
                        </button>
                      </div>
                    )
                )}
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
export default SignIn;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const providers = await getProviders();
  return {
    props: {
      csrfToken: await getCsrfToken(context),
      providers,
    },
  };
}
