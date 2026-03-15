import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import SubmitButton from '@/components/SubmitButton';
import { loginSchema, type loginType } from '../schemas/login-schema';
import { useState } from 'react';
import { loginApi } from '../api/login-api';
import { useMutation } from '@tanstack/react-query';
import { useAppDispatch } from '@/store/hook';
import { login } from '../auth.slice';
import ShowFormPassword from './ShowFormPassword';
import FormErrorMessage from '@/components/FormErrorMessage';

const LoginForm = () => {
  const dispatch = useAppDispatch();
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const form = useForm<loginType>({
    defaultValues: {
      email: '',
      password: '',
    },

    resolver: zodResolver(loginSchema),
  });

  const {
    setError,
    formState: {
      errors: { root },
    },
  } = form;

  const loginMutation = useMutation({
    mutationFn: loginApi,

    onSuccess: (data) => {
      dispatch(login(data));
    },

    onError: (err) => {
      let message = 'Une erreur est survenue';

      if (err instanceof Error) {
        message = err.message;
      }

      setError('root', { message });
    },
  });

  const handleFormSubmit = (credentials: loginType) => {
    loginMutation.mutate(credentials);
  };

  return (
    <Card className="w-md">
      <CardHeader>
        <CardTitle className="text-2xl text-center">
          Connexion
        </CardTitle>
        <CardDescription
          aria-describedby={undefined}
        ></CardDescription>
      </CardHeader>

      <CardContent>
        <form
          onSubmit={form.handleSubmit(handleFormSubmit)}
          className="flex flex-col gap-y-3"
        >
          <FieldGroup>
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
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Mot de passe</FieldLabel>
                  <Input
                    {...field}
                    type={showPassword ? 'text' : 'password'}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>

          <ShowFormPassword
            text="Afficher le mot de passe"
            showPassword={showPassword}
            onClick={() => setShowPassword((prev) => !prev)}
          />

          <FormErrorMessage message={root?.message} />

          <SubmitButton
            text="Se connecter"
            isDisabled={loginMutation.isPending}
            className={`w-full h-10`}
          />
        </form>
      </CardContent>
    </Card>
  );
};

export default LoginForm;
