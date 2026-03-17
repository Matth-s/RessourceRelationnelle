import type { categorySchemaType } from "../schemas/categories-schema";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  updateCategorySchema,
  type updateCategoryType,
} from "../schemas/update-category-schema";
import { useMutation } from "@tanstack/react-query";
import { updateCategoryApi } from "../api/update-category-api";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import FormErrorMessage from "@/components/FormErrorMessage";
import SubmitButton from "@/components/SubmitButton";

type UpdateCategoryFormProps = {
  category: Pick<categorySchemaType, "id" | "categoryName">;
};

const UpdateCategoryForm = ({ category }: UpdateCategoryFormProps) => {
  const form = useForm<updateCategoryType>({
    defaultValues: category,
    resolver: zodResolver(updateCategorySchema),
  });

  const {
    setError,
    formState: {
      errors: { root },
    },
  } = form;

  const categoryMutation = useMutation({
    mutationFn: updateCategoryApi,

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

  const handleFormSubmit = (category: categorySchemaType) => {
    categoryMutation.mutate(category);
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
              <FieldLabel>Nouveau nom de la catégorie</FieldLabel>
              <Input {...field} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      <FormErrorMessage message={root?.message} />

      <SubmitButton
        text="Modifier"
        isDisabled={categoryMutation.isPending}
        className={`h-10 w-full`}
      />
    </form>
  );
};

export default UpdateCategoryForm;
