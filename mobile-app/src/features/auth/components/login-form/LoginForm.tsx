import SubmitButton from "@/components/SubmitButton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Controller, useForm } from "react-hook-form";
import { loginSchema, type LoginSchema } from "./schemas/login-schemas";
import { zodResolver } from "@hookform/resolvers/zod/dist/zod.js";
import { loginApi } from "../../api/login-api";
import { useMutation } from "@tanstack/react-query";
import FormErrorMessage from "@/components/FormErrorMessage";
import { useAppDispatch } from "@/store/hook";
import { login } from "../../auth.slice";
import { useNavigate } from "react-router";

const LoginForm = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const form = useForm<LoginSchema>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(loginSchema),
  });

  const {
    handleSubmit,
    setError,
    reset,
    formState: {
      errors: { root },
    },
  } = form;

  const loginMutation = useMutation({
    mutationKey: ["login"],
    mutationFn: loginApi,

    onError(err: any) {
      let errorMessage = "Une erreur est survenue lors de la connexion.";

      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError("root", { message: errorMessage });
    },
    onSuccess: (data) => {
      dispatch(login(data));
      navigate("/");
    },
  });

  const handleFormSubmit = (data: LoginSchema) => {
    loginMutation.mutate(data);
  };

  return (
    <Card className="w-4/5 p-4">
      <CardHeader>
        <CardTitle className="text-center">Formulaire de connexion</CardTitle>
        <CardDescription className="text-center">
          Connectez-vous à votre compte
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          className="flex flex-col gap-3"
          onSubmit={handleSubmit(handleFormSubmit)}
        >
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
          <FormErrorMessage message={root?.message} />
          <SubmitButton
            isLoading={loginMutation.isPending}
            text="Se connecter"
          />
        </form>
      </CardContent>
    </Card>
  );
};

export default LoginForm;
