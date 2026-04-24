import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  resourceObjectSchema,
  type resourceObjectType,
} from "../schemas/ressource-schema";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { updateResourceById } from "../api/update-resource-by-id";
import { toast } from "sonner";
import { useState } from "react";
import { Edit } from "lucide-react";

import SubmitButton from "@/components/SubmitButton";
import FormErrorMessage from "@/components/FormErrorMessage";
import VisibilityResourceSelectForm from "./VisibilityResourceSelectForm";
import SelectModerationStatusResource from "./SelectModerationStatusResource";

type ModerateResourceModalProps = {
  resource: resourceObjectType;
};

const ModerateResourceModal = ({ resource }: ModerateResourceModalProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const form = useForm<resourceObjectType>({
    defaultValues: resource,
    resolver: zodResolver(resourceObjectSchema),
  });

  const {
    handleSubmit,
    setError,
    formState: {
      errors: { root },
    },
  } = form;

  const updateResourceMutation = useMutation({
    mutationFn: updateResourceById,
    onSuccess: () => {
      toast.success("Resource modifiée avec succès");
      setIsOpen(false);
    },

    onError: (err) => {
      let message = "Une erreur est survenue";

      if (err instanceof Error) {
        message = err.message;
      }

      setError("root", {
        message,
      });
    },
  });

  const handleFormSubmit = (data: resourceObjectType) => {
    updateResourceMutation.mutate(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Edit />
          Edit
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifier la resource</DialogTitle>
          <DialogDescription aria-describedby="undefined"></DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="flex flex-col gap-3"
        >
          <Controller
            name="publicationStatus"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Status de la publication</FieldLabel>
                <SelectModerationStatusResource
                  moderationStatus={field.value}
                  onChange={field.onChange}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="isVisible"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Visible</FieldLabel>
                <VisibilityResourceSelectForm
                  value={field.value}
                  onChange={field.onChange}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <FormErrorMessage message={root?.message} />

          <SubmitButton
            isDisabled={updateResourceMutation.isPending}
            text="Modifier"
          />
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ModerateResourceModal;
