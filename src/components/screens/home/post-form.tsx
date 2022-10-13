import Alert from "@components/ui/alert";
import ErrorText from "@components/ui/error-text";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createUpdatePostInput,
  createUpdatePostSchema,
} from "@schema/post.schema";
import { trpc } from "@utils/trpc";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

function PostForm({ editMode = false }: { editMode?: boolean }) {
  const router = useRouter();
  const { id } = router.query;

  const { mutate, error, isSuccess, data } =
    trpc.post.createUpdatePost.useMutation({
      onSuccess() {
        router.push("/");
      },
    });
  const onPostSubmit = (values: createUpdatePostInput) => {
    mutate(values);
  };
  const { data: singlePost, isLoading } = trpc.post.getSinglePost.useQuery(
    {
      id: id as string,
    },
    {
      enabled: editMode,
      refetchOnWindowFocus: false,
    }
  );

  const {
    handleSubmit,
    register,
    reset,
    formState: { defaultValues, errors },
  } = useForm<createUpdatePostInput>({
    resolver: zodResolver(createUpdatePostSchema),
    defaultValues: { id: "", title: "", body: "" },
  });
  useEffect(() => {
    const post = {
      id: singlePost?.id as string,
      title: singlePost?.title as string,
      body: singlePost?.body as string,
    };
    reset(post);
  }, [singlePost, reset]);

  const getSubmitButtonText = () => (editMode ? "Update" : "Add");

  if (editMode && isLoading) {
    return <p>loading ....</p>;
  }

  return (
    <>
      {JSON.stringify(defaultValues)}
      <form onSubmit={handleSubmit(onPostSubmit)}>
        {isSuccess && data && <Alert type="success">{data.message}</Alert>}
        {error && <Alert type="error">{error.message}</Alert>}
        <div className="py-6 leading-10 flex flex-col gap-y-6">
          <h1 className="text-3xl font-bold">
            <>{getSubmitButtonText()} Post</>
          </h1>
          <div className="flex flex-col">
            <label htmlFor="title">Title</label>
            <input
              className={`focus:ring-0 outline-none ${
                errors.title ? "focus:border-red-500" : ""
              }`}
              aria-invalid={errors.title ? true : false}
              type="text"
              placeholder="Example title"
              {...register("title")}
            />
            <ErrorText>{errors.title?.message}</ErrorText>
          </div>
          <div className="flex flex-col">
            <label htmlFor="body">Body</label>
            <textarea
              className={`focus:ring-0 outline-none ${
                errors.body ? "focus:border-red-500" : ""
              }`}
              aria-invalid={errors.body ? "true" : "false"}
              id="post-body"
              cols={30}
              rows={10}
              placeholder="Write something about title"
              {...register("body")}
            />
            <ErrorText>{errors.body?.message}</ErrorText>
          </div>
          <div>
            <button
              type="submit"
              className="bg-black text-white px-3 p-1.5 rounded-md"
            >
              <> {getSubmitButtonText()} Post</>
            </button>
          </div>
        </div>
      </form>
    </>
  );
}

export default PostForm;
