import PostCard from "@components/screens/home/post-card";
import Alert from "@components/ui/alert";
import { trpc } from "@utils/trpc";
import { useSession } from "next-auth/react";

function PostList() {
  const { data: session } = useSession();
  const { data, isLoading, refetch } = trpc.post.getAllPosts.useQuery();
  const { data: authorPostsCount } =
    trpc.post.getAuthorUnpublishedPostsCount.useQuery();
  if (isLoading) {
    return <p>Loading .....</p>;
  }
  if (data?.length === 0) {
    return <div className="text-center">No posts to show</div>;
  }
  return (
    <>
      {!!authorPostsCount && session?.user && (
        <Alert type="error">Your post is still pending to be published</Alert>
      )}

      <div className="flex flex-col gap-4">
        {data?.map((item, i) => (
          <PostCard {...item} key={i} postDeleted={refetch} />
        ))}
      </div>
    </>
  );
}

export default PostList;
