import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { BookOpenText } from "lucide-react";
import type { commentObjectType } from "../schemas/comments-schema";
import { Button } from "@/components/ui/button";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  moderateCommentSchema,
  type moderateCommentType,
} from "../schemas/moderate-comment-schema";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MODERATION_SELECT_CHOICE } from "../constants/comments-constants";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCommentApi } from "../api/update-comment-api";
import { FETCH_KEYS } from "@/types/fetch-key-type";
import { useState } from "react";
import { toast } from "sonner";

import FormErrorMessage from "@/components/FormErrorMessage";
import DeleteCommentButton from "./DeleteCommentButton";

type ShowCommentProps = {
  comment: commentObjectType;
};

const ShowComment = ({ comment }: ShowCommentProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [buttonLoading, setButtonLoading] = useState<boolean>(false);

  const queryClient = useQueryClient();

  const {
    user: { username },
    resource: { title },
    content,
  } = comment;

  const form = useForm<moderateCommentType>({
    defaultValues: {
      moderationStatus: comment.moderationStatus,
      commentId: comment.id,
    },
    resolver: zodResolver(moderateCommentSchema),
  });

  const {
    setError,
    handleSubmit,
    formState: {
      errors: { root },
    },
  } = form;

  const commentMutation = useMutation({
    mutationKey: ["comments"],
    mutationFn: updateCommentApi,

    onSuccess() {
      toast.success("Le commentaire a été modifié");
      queryClient.invalidateQueries({ queryKey: [FETCH_KEYS.COMMENTS] });
      setButtonLoading(false);
    },

    onError(err) {
      let errorMessage = "Une erreur est survenue";

      if (err instanceof Error) {
        errorMessage = err.message;
      }

      setError("root", {
        message: errorMessage,
      });

      setButtonLoading(false);
    },
  });

  const handleFormSubmit = (formData: moderateCommentType) => {
    setButtonLoading(true);
    commentMutation.mutate(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => setIsOpen((prev) => !prev)}>
      <DialogTrigger>
        <BookOpenText />
      </DialogTrigger>

      <DialogContent className="min-w-xl">
        <DialogHeader>
          <DialogTitle>Commentaire détaillé</DialogTitle>
          <DialogDescription>
            Commentaire détaillé de{" "}
            <span className="font-semibold">{username}</span> posté sur la
            resource <span className="font-semibold underline">{title}</span>
          </DialogDescription>

          <div>
            <div className="mb-4 max-h-[70vh] overflow-y-scroll">
              <p className="mb-3 font-bold underline">{username} a posté :</p>

              <p>{content}</p>
            </div>

            <div className="mx-auto flex flex-col justify-center">
              <form
                className="flex flex-col gap-y-3"
                onSubmit={handleSubmit((data) => {
                  handleFormSubmit(data);
                })}
              >
                <Controller
                  name="moderationStatus"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Status de la modération</FieldLabel>

                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>

                        <SelectContent>
                          {MODERATION_SELECT_CHOICE.map((choice) => (
                            <SelectItem key={choice.value} value={choice.value}>
                              {choice.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>
                  )}
                />

                <FormErrorMessage message={root?.message} />

                <div className="flex justify-center gap-x-4">
                  <Button
                    type="submit"
                    disabled={buttonLoading}
                    className="w-3/6"
                  >
                    Mettre à jour
                  </Button>

                  <DeleteCommentButton
                    setButtonLoading={(value: boolean) =>
                      setButtonLoading(value)
                    }
                    commentId={comment.id}
                    buttonLoading={buttonLoading}
                    closeModal={() => setIsOpen(false)}
                  />
                </div>
              </form>
            </div>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default ShowComment;
