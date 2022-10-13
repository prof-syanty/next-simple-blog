import { Dialog, Transition } from "@headlessui/react";
import { Post, User } from "@prisma/client";
import { trpc } from "@utils/trpc";
import moment from "moment";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Fragment, useState } from "react";

function PostCard({
  id,
  title,
  body,
  createdAt,
  author,
  authorId,
  updatedAt,
  postDeleted,
}: Post & {
  author: User;
  postDeleted: () => void;
}) {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const { mutate } = trpc.post.deletePost.useMutation({
    onSuccess() {
      postDeleted();
      closeModal();
    },
  });
  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  function proceedDelete() {
    mutate({ id });
  }
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
                      Confirm Dialog
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Do you want to delete post now?
                      </p>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 "
                        onClick={closeModal}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={proceedDelete}
                        type="button"
                        className="inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 "
                      >
                        Proceed
                      </button>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      )}
      <article className="p-4 bg-white text-black/70 rounded-md border hover:shadow-lg max-w-[600px] flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg">
            Posted By: <span className="text-green-500">{author.name}</span>
          </h3>
          {authorId === session?.user?.id && (
            <div className="flex items-center gap-4">
              <Link href={`/post/${id}/edit`}>
                <a className="bg-blue-500 p-1 rounded-md text-white">Edit</a>
              </Link>
              <button
                onClick={openModal}
                className="bg-red-500 p-1 rounded-md text-white"
              >
                Delete
              </button>
            </div>
          )}
        </div>
        <Link href={`/post/${id}`}>
          <a className="hover:text-blue-500">
            <h2 className="text-2xl font-bold">{title}</h2>
          </a>
        </Link>
        <p className="leading-7">{body}</p>
        <div className="flex items-center justify-between">
          <span className="text-black/40">
            Created {moment(createdAt).fromNow()}
          </span>
          <span className="text-black/40">
            Updated {moment(updatedAt).fromNow()}
          </span>
        </div>
      </article>
    </>
  );
}

export default PostCard;
