import PostCard from "@components/screens/home/post-card";
import { trpc } from "@utils/trpc";

function PostList() {
  const { data, isLoading, refetch } = trpc.post.getAllPosts.useQuery();
  if (isLoading) {
    return <p>Loading .....</p>;
  }
  if (data?.length === 0) {
    return <div className="text-center">No posts to show</div>;
  }
  return (
    <div className="flex flex-col gap-4">
      {data?.map((item, i) => (
        <PostCard {...item} key={i} postDeleted={refetch} />
      ))}
    </div>
  );
}

export default PostList;
