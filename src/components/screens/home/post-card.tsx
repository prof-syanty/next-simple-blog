import { Post, User } from "@prisma/client";
import moment from "moment";
import Link from "next/link";

function PostCard({
  title,
  body,
  createdAt,
  author,
}: Post & {
  author: User;
}) {
  return (
    <article className="p-4 bg-white text-black/70 rounded-md border hover:shadow-lg max-w-[600px] flex flex-col space-y-4">
      <h3 className="text-lg">
        Posted By: <span className="text-green-500">{author.name}</span>
      </h3>
      <Link href="/posts/slug">
        <a className="hover:text-blue-500">
          <h2 className="text-2xl font-bold">{title}</h2>
        </a>
      </Link>
      <p className="leading-7">{body}</p>
      <span className="text-black/40">{moment(createdAt).fromNow()}</span>
    </article>
  );
}

export default PostCard;
