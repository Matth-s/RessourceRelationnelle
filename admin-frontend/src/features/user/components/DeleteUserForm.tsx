import type { userSchemaType } from "../schemas/users-schema";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TrashIcon } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { deleteUserApi } from "../api/delete-user-api";

import FormErrorMessage from "@/components/FormErrorMessage";

type DeleteUserFormProps = {
  user: userSchemaType;
};

const DeleteUserForm = ({ user }: DeleteUserFormProps) => {
  const { isPending, error, mutate } = useMutation({
    mutationFn: deleteUserApi,
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <TrashIcon />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <FormErrorMessage message={error?.message} />

        <Button
          disabled={isPending}
          variant={"destructive"}
          onClick={() => mutate(user.id)}
        >
          Supprimer
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteUserForm;
