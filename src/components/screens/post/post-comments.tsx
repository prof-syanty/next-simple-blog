import PostCommentForm from "@components/screens/post/post-comment-form";
import { Disclosure } from "@headlessui/react";
import formComments, { formCommentsReturnType } from "@helpers/form-comments";
import { trpc } from "@utils/trpc";

import moment from "moment";

function ListComments({
  comments,
  refetch,
}: {
  comments: formCommentsReturnType;
  refetch: () => void;
}) {
  return (
    <>
      {comments?.map((comment, i) => (
        <div key={i} className="border-b last:border-b-0 pb-2">
          <div className="flex items-center gap-4">
            <p className="font-bold text-xl">{comment?.commentedBy?.name}</p>
            <p className="text-gray-400">
              {moment(comment?.createdAt).fromNow()}
            </p>
          </div>
          <div className="text-sm px-4 text-gray-500">{comment?.body}</div>
          <div className="flex justify-between px-6">
            <Disclosure as="div" className={"w-full"}>
              {({ close }) => (
                <>
                  <Disclosure.Button className="flex w-full justify-between ">
                    <p>{comment?.children?.length} replies</p>
                    <p className="bg-purple-600 px-2 text-white">Reply</p>
                  </Disclosure.Button>
                  <Disclosure.Panel className="w-full px-4 pt-4 pb-2 text-sm text-gray-500">
                    <PostCommentForm
                      postId={comment?.postId as string}
                      refetch={() => {
                        close();
                        refetch();
                      }}
                      parentId={comment?.id}
                    />
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>
          </div>
          {!!comment?.children?.length &&
            comment.children.map((child, i) => (
              <div className="px-6 border my-2" key={i}>
                <div className="flex items-center gap-4">
                  <p className="font-bold text-xl">
                    {child?.commentedBy?.name}
                  </p>
                  <p className="text-gray-400">
                    {moment(child?.createdAt).fromNow()}
                  </p>
                </div>
                <div className="text-sm px-4 text-gray-500">{child?.body}</div>
              </div>
            ))}
        </div>
      ))}
    </>
  );
}

function PostComments({ postId }: { postId: string | undefined }) {
  const { data, refetch } = trpc.comment.getAllCommentsByPostId.useQuery({
    id: postId as string,
  });
  return (
    <div className="border p-4 rounded-md">
      <PostCommentForm postId={postId} refetch={refetch} />
      <ListComments comments={formComments(data)} refetch={refetch} />
    </div>
  );
}

export default PostComments;
