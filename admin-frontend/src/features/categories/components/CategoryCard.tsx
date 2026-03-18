import { useState } from "react";
import type { categorySchemaType } from "../schemas/categories-schema";
import { Button } from "@/components/ui/button";
import { Pen, Trash } from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table";
import CategoryModal from "./CategoryModal";
import UpdateCategoryForm from "./UpdateCategoryForm";
import DeleteCategoryForm from "./DeleteCategoryForm";

type CategoryCardProps = {
  category: categorySchemaType;
};

const CategoryCard = ({ category }: CategoryCardProps) => {
  const { categoryName, id } = category;

  const [modalType, setModalType] = useState<"edit" | "delete" | null>(null);

  const closeModal = () => setModalType(null);

  let formContent = null;

  if (modalType === "edit") {
    formContent = (
      <UpdateCategoryForm
        closeModal={closeModal}
        category={{ id, categoryName }}
      />
    );
  } else if (modalType === "delete") {
    formContent = (
      <DeleteCategoryForm
        closeModal={closeModal}
        category={{ id, categoryName }}
      />
    );
  }

  return (
    <>
      <TableRow className="hover:bg-muted/50 text-center transition-colors">
        <TableCell className="font-medium">{categoryName}</TableCell>

        <TableCell className="text-muted-foreground">
          Je suis de la description
        </TableCell>

        <TableCell>50</TableCell>

        <TableCell className="text-muted-foreground">
          {new Date().toLocaleDateString()}
        </TableCell>

        <TableCell className="flex items-center justify-center gap-x-3">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setModalType("edit")}
          >
            <Pen size={16} />
          </Button>

          <Button
            variant="destructive"
            size="icon"
            onClick={() => setModalType("delete")}
          >
            <Trash size={16} />
          </Button>
        </TableCell>
      </TableRow>

      <CategoryModal
        isOpen={modalType !== null}
        dialogButton={null}
        setIsOpen={closeModal}
        dialogTitle={modalType === "edit" ? "Modifier la catégorie" : ""}
        dialogDescription={
          modalType === "edit" ? "Modifier le nom de la catégorie" : ""
        }
        form={formContent}
      />
    </>
  );
};

export default CategoryCard;
