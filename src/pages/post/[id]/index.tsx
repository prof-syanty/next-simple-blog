import PostComments from "@components/screens/post/post-comments";
import { trpc } from "@utils/trpc";
import moment from "moment";
import Link from "next/link";
import { useRouter } from "next/router";

function SinglePost() {
  const {
    query: { id },
  } = useRouter();

  const { data: post } = trpc.post.getSinglePost.useQuery({
    id: id as string,
  });

  return (
    <>
      <div className="py-6">
        <div className="leading-10 max-w-5xl mx-auto ">
          <Link href={"/"}>
            <a className="hover:underline">Go back to Home</a>
          </Link>
          <div className="border p-4">
            <h1 className="font-bold flex items-center space-x-7">
              <span> Author: </span>
              <span className="text-green-500">{post?.author.name}</span>
              <span className="text-sm text-gray-500">
                {moment(post?.createdAt).fromNow()}
              </span>
            </h1>
            <h2 className="text-2xl py-3 font-bold">Title: {post?.title}</h2>
            <p className="text-gray-400">Body: {post?.body}</p>
          </div>
          <div className="my-4">
            <h1 className="text-xl font-bold">Comments</h1>

            <PostComments postId={post?.id} />
          </div>
        </div>
      </div>
    </>
  );
}

export default SinglePost;
