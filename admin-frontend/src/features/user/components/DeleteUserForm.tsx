import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FETCH_KEYS } from "@/types/fetch-key-type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash } from "lucide-react";
import type { userSchemaType } from "../schemas/users-schema";
import { Button } from "@/components/ui/button";
import { deleteUserApi } from "../api/delete-user-api";
import { useState } from "react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import FormErrorMessage from "@/components/FormErrorMessage";

type DeleteUserFormProps = {
  user: userSchemaType;
};

const DeleteUserForm = ({ user }: DeleteUserFormProps) => {
  const queryClient = useQueryClient();
  const [textInput, setInputText] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined,
  );

  const canSubmit = textInput !== user.username;

  const deleteMutation = useMutation({
    mutationKey: [FETCH_KEYS],
    mutationFn: deleteUserApi,

    onError(err) {
      setErrorMessage("Une erreur est survenue");

      if (err instanceof Error) {
        setErrorMessage(err.message);
      }
    },

    onSuccess() {
      setIsOpen(false);

      toast.success(
        `L'utilisateur ${user.username} a été supprimé avec succès`,
      );

      queryClient.invalidateQueries({ queryKey: [FETCH_KEYS.USERS] });
    },
  });

  const handleClick = (value: string) => {
    if (textInput !== user.username) return;

    deleteMutation.mutate(value);
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => setIsOpen((prev) => !prev)}>
      <DialogTrigger asChild>
        <Button variant={"destructive"}>
          <Trash />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Supprimez l'utilisateur</DialogTitle>
          <DialogDescription aria-describedby="undefined"></DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-y-3">
          <FormErrorMessage message={errorMessage} />

          <Label htmlFor="confirm">
            Tapez {user.username} pour pouvoir supprimez l'utilisateur
          </Label>

          <Input
            id="confirm"
            defaultValue={textInput}
            onChange={(e) => setInputText(e.target.value)}
          />

          <Button
            disabled={deleteMutation.isPending || canSubmit}
            variant={"destructive"}
            onClick={() => handleClick(user.id)}
            className="w-full"
          >
            Supprimer l'utilisateur
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteUserForm;
