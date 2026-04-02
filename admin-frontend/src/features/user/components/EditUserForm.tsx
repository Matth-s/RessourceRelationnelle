import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { EditIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { userSchemaType } from "../schemas/users-schema";
import { useMutation } from "@tanstack/react-query";
import { updateUserApi } from "../api/update-user-api";
import { toast } from "sonner";

type EditUserFormProps = {
  user: userSchemaType;
};

const EditUserForm = ({ user }: EditUserFormProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const form = useForm({
    defaultValues: {},
  });

  const {
    setError,
    handleSubmit,
    formState: {
      errors: { root },
    },
  } = form;

  const updateMutation = useMutation({
    mutationFn: updateUserApi,

    onError(err) {
      setError("root", {
        message: err.message,
      });
    },

    onSuccess(res) {
      toast.success("L'utilisateur changerNom a été modifié avec succès");
    },
  });

  const handleFormSubmit = (): void => {
    updateMutation.mutate();
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => setIsOpen((prev) => !prev)}>
      <DialogTrigger asChild>
        <Button>
          <EditIcon />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifier l'utilisateur {user.username}</DialogTitle>
          <DialogDescription aria-describedby={undefined}></DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)}></form>
      </DialogContent>
    </Dialog>
  );
};

export default EditUserForm;
