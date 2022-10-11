import { Dialog, Transition } from "@headlessui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { userSignUpInput, userSignUpSchema } from "@schema/user.schema";
import { trpc } from "@utils/trpc";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Fragment, useState } from "react";
import { useForm } from "react-hook-form";

const SignUp = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  function gotoHome() {
    router.push("/");
    closeModal();
  }

  function gotoSignin() {
    signOut({
      callbackUrl: "/auth/signin",
    });
    closeModal();
  }

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<userSignUpInput>({
    resolver: zodResolver(userSignUpSchema),
  });
  const { mutate, error } = trpc.auth.signup.useMutation({
    onSuccess: () => {
      openModal();
    },
  });
  const submitHandler = (values: userSignUpInput) => {
    mutate(values);
  };

  return (
    <>
      {isOpen && (
        <Transition appear show={isOpen} as={Fragment}>
          <Dialog as="div" className="relative z-10" onClose={closeModal}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-25" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4 text-center">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium leading-6 text-gray-900"
                    >
                      User registration successful
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Do you want to login now?
                      </p>
                      {session && (
                        <p className="text-sm text-red-400">
                          Looks like you are already logged in.
                        </p>
                      )}
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 "
                        onClick={gotoHome}
                      >
                        Go to Home
                      </button>
                      {session && (
                        <button
                          type="button"
                          className="inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 "
                          onClick={gotoSignin}
                        >
                          Signout & Login Now
                        </button>
                      )}
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      )}
      <div className="flex flex-col items-center justify-center">
        <div className="max-w-sm ">
          <h1 className="text-3xl font-bold text-center py-3">REGISTER FORM</h1>
          {error && (
            <div className="text-center text-red-500 bg-red-50 p-2 mb-2">
              {JSON.stringify(error.message).replaceAll('"', "")}
            </div>
          )}
          <form onSubmit={handleSubmit(submitHandler)}>
            <div className="flex flex-col space-y-3 border  p-6">
              <div className="flex flex-col space-y-2">
                <label htmlFor="name">Name</label>
                <input
                  className={`focus:ring-0 outline-none ${
                    errors.name ? "focus:border-red-500" : ""
                  }`}
                  {...register("name")}
                  type="text"
                  aria-invalid={errors.name ? "true" : "false"}
                />
              </div>
              <div className="flex flex-col space-y-2">
                <label htmlFor="email">Email</label>
                <input
                  {...register("email")}
                  type="email"
                  className={`focus:ring-0 outline-none ${
                    errors.name ? "focus:border-red-500" : ""
                  }`}
                />
              </div>
              <div className="flex flex-col space-y-2">
                <label htmlFor="password">Password</label>
                <input
                  {...register("password")}
                  type="password"
                  className={`focus:ring-0 outline-none ${
                    errors.name ? "focus:border-red-500" : ""
                  }`}
                />
              </div>
              <div>
                <button
                  type="submit"
                  className="bg-black text-white p-2 rounded-md w-full"
                >
                  SignUp
                </button>
                <Link href="/auth/login">
                  <a className="block text-center p-2 text-blue-500 hover:underline">
                    Already have an account?
                  </a>
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
export default SignUp;
