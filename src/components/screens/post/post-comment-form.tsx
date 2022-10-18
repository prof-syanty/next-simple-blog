import ErrorText from "@components/ui/error-text";
import { zodResolver } from "@hookform/resolvers/zod";
import { postCommentInput, postCommentSchema } from "@schema/comment.schema";
import { trpc } from "@utils/trpc";
import { useForm } from "react-hook-form";

function PostCommentForm({
  postId,
  parentId,
  refetch,
}: {
  postId: string | undefined;
  parentId?: string;
  refetch: () => void;
}) {
  const { mutate } = trpc.comment.addPostComment.useMutation({
    onSuccess() {
      refetch();
      reset();
    },
  });

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<postCommentInput>({
    resolver: zodResolver(postCommentSchema),
  });

  const submitComment = (values: postCommentInput) => {
    mutate({
      body: values.body,
      postId: postId as string,
      parentId,
    });
  };

  return (
    <div className="border p-4 mb-4">
      <form onSubmit={handleSubmit(submitComment)}>
        <div>
          <textarea
            className={`w-full focus:ring-0 outline-none ${
              errors.body ? "focus:border-red-500" : ""
            }`}
            aria-invalid={errors.body ? true : false}
            {...register("body")}
            rows={5}
          />
          <ErrorText>{errors.body?.message}</ErrorText>
        </div>
        <div className="text-right">
          <button
            className="bg-blue-500 text-white p-1 px-2 rounded-md"
            type="submit"
          >
            Post Comment
          </button>
        </div>
      </form>
    </div>
  );
}

export default PostCommentForm;
