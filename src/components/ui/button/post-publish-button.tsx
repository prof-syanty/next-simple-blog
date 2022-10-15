import ConfirmDialog from "@components/ui/dialog/confirm-dialog";
import DialogToggle from "@components/ui/dialog/dialog-toggle";
import { trpc } from "@utils/trpc";

function PostPublishButton({
  postId,
  isPublished,
  refetch,
}: {
  postId: string;
  isPublished: boolean;
  refetch: () => void;
}) {
  const { mutate } = trpc.post.changePublishStatus.useMutation({
    onSuccess() {
      refetch();
    },
  });
  function proceed() {
    mutate({ id: postId, isPublished });
  }
  return (
    <DialogToggle>
      {({ isDialogOpen, toggleDialog }) => (
        <>
          <button
            onClick={toggleDialog}
            className={`p-2 rounded-md bg-gray-500 text-white ${
              isPublished && "bg-purple-400"
            }`}
          >
            {isPublished ? "Unpublish" : "Publish"}
          </button>
          <ConfirmDialog
            isDialogOpen={isDialogOpen}
            toggleDialog={toggleDialog}
            proceed={() => {
              proceed();
              toggleDialog();
            }}
          >
            Do you want to {isPublished ? "unpublish" : "publish"} the post now?
          </ConfirmDialog>
        </>
      )}
    </DialogToggle>
  );
}

export default PostPublishButton;
