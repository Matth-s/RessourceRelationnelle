import "./style.scss";
import { useMutation } from "@tanstack/react-query";
import { registerApi } from "../../api/register-api";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  registerSchema,
  type RegisterSchema,
} from "./schemas/register-schemas";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import SubmitButton from "@/components/SubmitButton";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import FormErrorMessage from "@/components/FormErrorMessage";
import FormSuccessMessage from "@/components/FormSuccessMessage";
import { useState } from "react";
import { FormNavigateButton } from "../FormNavigateButton";

const RegisterForm = () => {
  const [showEmailSend, setShowEmailSend] = useState<boolean>(false);

  const form = useForm<RegisterSchema>({
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    resolver: zodResolver(registerSchema),
  });

  const {
    handleSubmit,
    setError,
    reset,
    formState: {
      errors: { root },
    },
  } = form;

  const registerMutation = useMutation({
    mutationKey: ["register"],
    mutationFn: registerApi,

    onError(err: any) {
      let errorMessage = "Une erreur est survenue lors de l'inscription.";

      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      setError("root", {
        message: errorMessage,
      });
    },
    onSuccess() {
      reset();
      setShowEmailSend(true);
    },
  });

  const handleFormSubmit = (data: RegisterSchema) => {
    registerMutation.mutate(data);
  };

  return (
    <Card className="w-4/5 p-4">
      <CardHeader>
        <CardTitle className="text-center">Formulaire d'inscription</CardTitle>
        <CardDescription className="text-center">
          Veuillez remplir le formulaire pour créer un compte.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          className="flex flex-col gap-3"
          onSubmit={handleSubmit(handleFormSubmit)}
        >
          <Controller
            name="username"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Username</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  placeholder="Nom d'utilisateur"
                  autoComplete="off"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  placeholder="Addresse email"
                  autoComplete="off"
                />
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
                <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  placeholder="Mot de passe"
                  type="password"
                  autoComplete="off"
                />
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
                <FieldLabel htmlFor={field.name}>Confirm Password</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  placeholder="Confirmer le mot de passe"
                  type="password"
                  autoComplete="off"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          {showEmailSend ? (
            <FormSuccessMessage
              message="Inscription réussie. Veuillez vérifier votre email. Pour vous connecter, "
              link="login"
              linkTexte="cliquez-ici"
            />
          ) : null}
          <FormErrorMessage message={root?.message} />
          <SubmitButton
            isLoading={registerMutation.isPending}
            text="S'inscrire"
          />
          <FormNavigateButton
            to="login"
            text="Déjà un compte ? Connectez-vous ici."
          />
        </form>
      </CardContent>
    </Card>
  );
};

export default RegisterForm;
