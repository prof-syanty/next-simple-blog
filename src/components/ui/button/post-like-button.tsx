import { trpc } from "@utils/trpc";

function PostLikeButton({
  likesCount,
  postId,
  isLiked,
  refetch,
}: {
  likesCount: number;
  postId: string;
  isLiked: boolean;
  refetch: () => void;
}) {
  const { mutate } = trpc.post.likeUnlikePost.useMutation({
    onSuccess() {
      refetch();
    },
  });

  const likeOrUnlike = () => {
    mutate({
      id: postId,
      like: !isLiked,
    });
  };

  return (
    <button
      onClick={likeOrUnlike}
      className={`p-2 rounded-md bg-gray-200 ${
        isLiked ? "text-blue-600" : "text-gray-400"
      }`}
    >
      {likesCount} Likes
    </button>
  );
}

export default PostLikeButton;
