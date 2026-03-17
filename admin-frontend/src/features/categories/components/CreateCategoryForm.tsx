import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createCategorySchema,
  type createCategoryType,
} from "../schemas/create-category-schema";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import SubmitButton from "@/components/SubmitButton";
import { useMutation } from "@tanstack/react-query";
import { createCategoryApi } from "../api/create-category-api";
import FormErrorMessage from "@/components/FormErrorMessage";

export const CreateCategoryForm = () => {
  const form = useForm<createCategoryType>({
    defaultValues: {
      categoryName: "",
    },
    resolver: zodResolver(createCategorySchema),
  });

  const {
    setError,
    formState: {
      errors: { root },
    },
  } = useForm();

  const categoryMutation = useMutation({
    mutationFn: createCategoryApi,

    onSuccess: (data) => {
      console.log(data);
    },

    onError: (err) => {
      let message = "Une erreur est survenue";

      if (err instanceof Error) {
        message = err.message;
      }

      setError("root", { message });
    },
  });

  const handleFormSubmit = (newCategory: createCategoryType) => {
    categoryMutation.mutate(newCategory);
  };

  return (
    <form
      onSubmit={form.handleSubmit(handleFormSubmit)}
      className="flex flex-col gap-y-3"
    >
      <FieldGroup>
        <Controller
          name="categoryName"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Nom de la catégorie</FieldLabel>
              <Input {...field} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      <FormErrorMessage message={root?.message} />

      <SubmitButton
        text="Se connecter"
        isDisabled={categoryMutation.isPending}
        className={`h-10 w-full`}
      />
    </form>
  );
};

export default CreateCategoryForm;
