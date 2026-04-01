import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useState } from "react";
import { FETCH_KEYS } from "@/types/fetch-key-type";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { updateUserApi } from "../api/update-user-api";
import {
  updateUserSchema,
  type updateUserType,
} from "../schemas/update-user-schema";
import type { userSchemaType } from "../schemas/users-schema";

import FormErrorMessage from "@/components/FormErrorMessage";
import SubmitButton from "@/components/SubmitButton";
import SelectActiveForm from "./SelectActiveForm";

type UpdateUserFormProps = {
  user: userSchemaType;
};

const UpdateUserForm = ({ user }: UpdateUserFormProps) => {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { email, username, role, isActive, emailVerified } = user;

  const form = useForm<updateUserType>({
    defaultValues: {
      email,
      username,
      role,
      isActive,
      emailVerified,
    },
    resolver: zodResolver(updateUserSchema),
  });

  const {
    handleSubmit,
    setError,
    formState: {
      errors: { root },
    },
  } = form;

  const updateMutation = useMutation({
    mutationKey: [FETCH_KEYS.USERS],
    mutationFn: updateUserApi,

    onError(err) {
      let errorMessageBlock = "Une erreur est survenue";

      if (err instanceof Error) {
        errorMessageBlock = err.message;
      }

      setError("root", {
        message: errorMessageBlock,
      });
    },

    onSuccess() {
      queryClient.invalidateQueries({ queryKey: [FETCH_KEYS.USERS] });
      setIsOpen(false);
      toast.success("L'utilisateur a été modifié");
    },
  });

  const handleFormSubmit = (formData: updateUserType) => {
    updateMutation.mutate({ formData, userId: user.id });
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => setIsOpen((prev) => !prev)}>
      <DialogTrigger asChild>
        <Button>
          <Pencil />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Modifier les informations de {user.username}
          </DialogTitle>
          <DialogDescription aria-describedby="undefined"></DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="flex flex-col gap-y-3"
        >
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Email</FieldLabel>
                <Input {...field} />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="username"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Nom d'utilisateur</FieldLabel>
                <Input {...field} />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {/* <Controller
              name="role"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Sport pratiqué</FieldLabel>
                  <SelectFormRole
                    value={field.value}
                    onChange={field.onChange}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            /> */}

          <Controller
            name="isActive"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>
                  Etat de l'utilisateur
                </FieldLabel>
                <SelectActiveForm
                  isActive={field.value}
                  onChange={field.onChange}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <FormErrorMessage message={root?.message} />

          <SubmitButton isDisabled={updateMutation.isPending} text="Modifier" />
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateUserForm;
