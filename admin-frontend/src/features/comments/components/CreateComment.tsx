import { Textarea } from "@/components/ui/textarea";
import { Controller, useForm } from "react-hook-form";
import {
  createCommentSchema,
  type createCommentType,
} from "../schemas/create-comment-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCommentApi } from "../api/create-comment-api";
import { toast } from "sonner";
import { FETCH_KEYS } from "@/types/fetch-key-type";

import SubmitButton from "@/components/SubmitButton";

type CreateCommentProps = {
  resourceId: string;
};

const CreateComment = ({ resourceId }: CreateCommentProps) => {
  const queryClient = useQueryClient();
  const form = useForm<createCommentType>({
    defaultValues: {
      content: "",
      resourceId,
    },
    resolver: zodResolver(createCommentSchema),
  });

  const postMutation = useMutation({
    mutationFn: createCommentApi,

    onSuccess() {
      toast.success("Votre commentaire a été posté");
      queryClient.invalidateQueries({
        queryKey: [FETCH_KEYS.COMMENTS + resourceId],
      });
    },

    onError(err) {
      let errorMessage = "Une erreur est survenue";

      if (err instanceof Error) {
        errorMessage = err.message;
      }

      toast.error(errorMessage);
    },
  });

  const { handleSubmit } = form;

  const handleFormSubmit = (data: createCommentType) => {
    postMutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="flex gap-x-4">
      <Controller
        name="content"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel>Poster un commentaire</FieldLabel>
            <Textarea {...field} />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <SubmitButton
        className="mt-6"
        isDisabled={postMutation.isPending}
        text="Poster"
      />
    </form>
  );
};

export default CreateComment;
