import PostDeleteButton from "@components/ui/button/post-delete-button";
import { Post, User } from "@prisma/client";
import moment from "moment";
import { useSession } from "next-auth/react";
import Link from "next/link";

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

  return (
    <>
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
              <PostDeleteButton refetch={postDeleted} postId={id} />
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
