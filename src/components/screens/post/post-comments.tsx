import PostCommentForm from "@components/screens/post/post-comment-form";
import { Disclosure } from "@headlessui/react";
import { trpc } from "@utils/trpc";
import moment from "moment";

function PostComments({ postId }: { postId: string | undefined }) {
  const { data, refetch } = trpc.comment.getAllCommentsByPostId.useQuery({
    id: postId as string,
  });
  return (
    <div className="border p-4 rounded-md">
      <PostCommentForm postId={postId} refetch={refetch} />
      {data?.length ? (
        data.map((comment) => (
          <div key={comment.id}>
            {comment.parentId && (
              <div className="border-b last:border-b-0 pb-2">
                <div className="flex items-center gap-4">
                  <p>{comment.commentedBy?.name}</p>
                  <p>{moment(comment.createdAt).fromNow()}</p>
                </div>
                <div className="">{comment.body}</div>
                <div className="flex justify-between">
                  <Disclosure as="div" className={"w-full"}>
                    {({ open }) => (
                      <>
                        <Disclosure.Button className="flex w-full justify-between ">
                          <p>{comment.children.length}</p>
                          <p className="bg-purple-600 px-2 text-white">Reply</p>
                        </Disclosure.Button>
                        <Disclosure.Panel className="w-full px-4 pt-4 pb-2 text-sm text-gray-500">
                          <PostCommentForm
                            postId={postId}
                            refetch={refetch}
                            parentId={comment.id}
                          />
                        </Disclosure.Panel>
                      </>
                    )}
                  </Disclosure>
                </div>
              </div>
            )}
          </div>
        ))
      ) : (
        <p>No comments yet</p>
      )}
    </div>
  );
}

export default PostComments;
