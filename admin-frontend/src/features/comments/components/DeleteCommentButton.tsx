import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCommentApi } from "../api/delete-comment-api";
import { toast } from "sonner";
import { FETCH_KEYS } from "@/types/fetch-key-type";
import { Button } from "@/components/ui/button";

type DeleteCommentButtonProps = {
  setButtonLoading: (value: boolean) => void;
  closeModal: () => void;
  buttonLoading: boolean;
  commentId: string;
};

const DeleteCommentButton = ({
  setButtonLoading,
  closeModal,
  commentId,
  buttonLoading,
}: DeleteCommentButtonProps) => {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: deleteCommentApi,

    onSuccess() {
      toast.success("Le commentaire a été supprimé");
      queryClient.invalidateQueries({ queryKey: [FETCH_KEYS.COMMENTS] });
      setButtonLoading(false);
      closeModal();
    },
  });

  return (
    <Button
      type="button"
      variant="destructive"
      disabled={buttonLoading}
      className="w-3/6"
      onClick={() => {
        setButtonLoading(true);
        deleteMutation.mutate(commentId);
      }}
    >
      Supprimer
    </Button>
  );
};

export default DeleteCommentButton;
