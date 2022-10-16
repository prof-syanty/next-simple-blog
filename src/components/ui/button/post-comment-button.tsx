import Link from "next/link";

function PostCommentButton({
  commentsCount,
  postId,
}: {
  commentsCount: number;
  postId: string;
}) {
  return (
    <Link href={`/post/${postId}`}>
      <a
        className={`p-2 rounded-md bg-white border border-gray-300 hover:bg-gray-300`}
      >
        {commentsCount} Comments
      </a>
    </Link>
  );
}

export default PostCommentButton;
