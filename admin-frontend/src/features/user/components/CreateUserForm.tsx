import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  createUserSchema,
  type createUserSchemaType,
} from "../schemas/create-user-schema";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createUserApi } from "../api/create-user-api";
import SubmitButton from "@/components/SubmitButton";
import FormErrorMessage from "@/components/FormErrorMessage";
import { FETCH_KEYS } from "@/types/fetch-key-type";
import { toast } from "sonner";
import ShowFormPassword from "@/features/auth/components/ShowFormPassword";

const CreateUserForm = () => {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const form = useForm<createUserSchemaType>({
    defaultValues: {
      email: "",
      role: ["User"],
      confirmPassword: "",
      password: "",
      username: "",
    },

    resolver: zodResolver(createUserSchema),
  });

  const {
    handleSubmit,
    setError,
    reset,
    formState: {
      errors: { root },
    },
  } = form;

  const createMutation = useMutation({
    mutationKey: [""],
    mutationFn: createUserApi,

    onError(err) {
      let errorMessage = "Une erreur est survenue";

      if (err instanceof Error) {
        errorMessage = err.message;
      }

      setError("root", {
        message: errorMessage,
      });
    },

    onSuccess() {
      reset();
      setIsOpen(false);
      queryClient.invalidateQueries({ queryKey: [FETCH_KEYS.USERS] });
      toast.success("L'utilisateur a été crée avec succès");
      setShowPassword(false);
    },
  });

  const handleFormSubmit = (formData: createUserSchemaType) => {
    createMutation.mutate(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => setIsOpen((prev) => !prev)}>
      <DialogTrigger asChild>
        <Button>Ajouter un utilisateur</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogTrigger>
          <DialogTitle>Créer un nouvel utilisateur</DialogTitle>
          <DialogDescription>
            Lors de la création du compte l'utilisateur recevra un email pour
            confirmer son email
          </DialogDescription>
        </DialogTrigger>

        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="flex flex-col gap-y-2"
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

          <Controller
            name="role"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Roles</FieldLabel>
                <Input {...field} />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Mot de passe</FieldLabel>
                <Input {...field} type={showPassword ? "text" : "password"} />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="confirmPassword"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Confirmez le mot de passe</FieldLabel>
                <Input {...field} type={showPassword ? "text" : "password"} />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <ShowFormPassword
            showPassword={showPassword}
            onClick={() => setShowPassword((prev) => !prev)}
            text="Afficher les mots de passe"
          />

          <FormErrorMessage message={root?.message} />
          <SubmitButton text="Créer" isDisabled={createMutation.isPending} />
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateUserForm;
