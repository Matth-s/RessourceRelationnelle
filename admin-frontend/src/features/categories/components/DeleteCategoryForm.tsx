import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { categorySchemaType } from "../schemas/categories-schema";
import { Button } from "@/components/ui/button";
import { deleteCategoryApi } from "../api/delete-category-api";
import { FETCH_KEYS } from "@/types/fetch-key-type";
import { useState } from "react";
import { toast } from "sonner";

import FormErrorMessage from "@/components/FormErrorMessage";

type DeleteCategoryFormProps = {
  category: categorySchemaType;
  closeModal: () => void;
};

const DeleteCategoryForm = ({
  category,
  closeModal,
}: DeleteCategoryFormProps) => {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | undefined>(undefined);

  const categoryMutation = useMutation({
    mutationFn: deleteCategoryApi,

    onSuccess() {
      toast.success(`La catégorie ${category.categoryName} a été supprimé`);
      queryClient.invalidateQueries({ queryKey: [FETCH_KEYS.CATEGORY] });
      closeModal();
    },

    onError(err) {
      let message =
        "Une erreur est survenue lors de la suppression de la catégorie";

      if (err instanceof Error) {
        message = err.message;
      }
      setError(message);
    },
  });

  const handleDelete = () => {
    setError(undefined);
    categoryMutation.mutate(category.id);
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="space-y-2">
        <h3 className="text-destructive text-lg font-semibold">
          Supprimer la catégorie
        </h3>

        <p className="text-muted-foreground text-sm">
          Êtes-vous sûr de vouloir supprimer la catégorie{" "}
          <span className="text-foreground font-medium">
            {category.categoryName}
          </span>{" "}
          ?
        </p>

        <p className="text-muted-foreground text-xs">
          Cette action est irréversible.
        </p>
      </div>

      <FormErrorMessage message={error} />

      <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          onClick={closeModal}
          disabled={categoryMutation.isPending}
        >
          Annuler
        </Button>

        <Button
          variant="destructive"
          onClick={handleDelete}
          disabled={categoryMutation.isPending}
        >
          {categoryMutation.isPending ? "Suppression..." : "Supprimer"}
        </Button>
      </div>
    </div>
  );
};

export default DeleteCategoryForm;
