import ConfirmDialog from "@components/ui/dialog/confirm-dialog";
import DialogToggle from "@components/ui/dialog/dialog-toggle";
import { trpc } from "@utils/trpc";

function PostDeleteButton({
  postId,
  refetch,
}: {
  postId: string;
  refetch: () => void;
}) {
  const { mutate } = trpc.post.deletePost.useMutation({
    onSuccess() {
      refetch();
    },
  });
  function proceedDelete() {
    mutate({ id: postId });
  }
  return (
    <DialogToggle>
      {({ isDialogOpen, toggleDialog }) => (
        <>
          <button
            onClick={toggleDialog}
            className="bg-red-500 p-1 rounded-md text-white"
          >
            Delete
          </button>
          <ConfirmDialog
            isDialogOpen={isDialogOpen}
            toggleDialog={toggleDialog}
            proceed={() => {
              proceedDelete();
              toggleDialog();
            }}
          >
            Do you want to delete post now?
          </ConfirmDialog>
        </>
      )}
    </DialogToggle>
  );
}

export default PostDeleteButton;
