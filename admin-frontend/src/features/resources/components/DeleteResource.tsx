import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Controller, useForm } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteResourceById } from "../api/delete-resource-by-id-api";

import type { resourceObjectType } from "../schemas/ressource-schema";
import type { deleteResourceType } from "../schemas/delete-resource-schema";

import FormErrorMessage from "@/components/FormErrorMessage";
import SubmitButton from "@/components/SubmitButton";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { FETCH_KEYS } from "@/types/fetch-key-type";

type DeleteResourceDialogProps = {
  resource: resourceObjectType;
};

const DeleteResourceDialog = ({ resource }: DeleteResourceDialogProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const form = useForm<deleteResourceType>({
    defaultValues: {
      confirm: "",
      resourceId: resource.id,
    },
  });

  const {
    handleSubmit,
    watch,
    setError,
    formState: {
      errors: { root },
    },
  } = form;

  const confirmIsCorrect = watch("confirm") === "Confirmer";

  const resourceMutation = useMutation({
    mutationFn: deleteResourceById,

    onSuccess() {
      navigate("/ressources");
      queryClient.invalidateQueries({ queryKey: [FETCH_KEYS.RESOURCES] });
      toast.success(
        `La ressource : ${resource.title} a été supprimé avec succès`,
      );
    },

    onError(err) {
      let message = "Une erreur est survenue";

      if (err instanceof Error) {
        message = err.message;
      }

      setError("root", {
        message,
      });
    },
  });

  const handleFormSubmit = (data: deleteResourceType) => {
    resourceMutation.mutate(data);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Supprimer</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Êtes vous sur de vouloir supprimer la ressource {resource.title}
          </DialogTitle>

          <DialogDescription>
            Attention cette action sera irréversible
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="flex flex-col gap-y-3"
        >
          <Controller
            name="confirm"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel
                  htmlFor={field.name}
                  className="block text-left leading-snug"
                >
                  Tapez "<span className="font-bold">Confirmer</span>" pour
                  pouvoir supprimer la ressource
                </FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  placeholder="Confirmer"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <FormErrorMessage message={root?.message} />

          <SubmitButton
            isDisabled={resourceMutation.isPending || !confirmIsCorrect}
            variant="destructive"
            text="Supprimer"
          />
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteResourceDialog;
