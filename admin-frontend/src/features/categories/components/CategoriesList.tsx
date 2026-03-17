import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";

import type { categoriesArrayType } from "../schemas/categories-schema";
import { CATEGORIES_HEADER_TABLE } from "../constants/categories-constant";
import CategoryModal from "./CategoryModal";
import { Button } from "@/components/ui/button";
import { Pen, Trash } from "lucide-react";
import UpdateCategoryForm from "./UpdateCategoryForm";

type CategoriesListProps = {
  categories: categoriesArrayType;
  isLoading: boolean;
};

const CategoriesList = ({ categories, isLoading }: CategoriesListProps) => {
  if (isLoading) {
    return <p>Chargement...</p>;
  }

  if (!categories?.length) {
    return <p>Aucune catégorie</p>;
  }

  return (
    <div className="bg-muted/40 mx-auto w-[90%] overflow-hidden rounded-xl border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/60">
            {CATEGORIES_HEADER_TABLE.map((header) => (
              <TableHead
                key={header.name}
                className="text-muted-foreground text-center text-sm font-semibold"
              >
                {header.name}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {categories.map((category) => (
            <TableRow
              key={category.id}
              className="hover:bg-muted/50 text-center transition-colors"
            >
              <TableCell className="font-medium">
                {category.categoryName}
              </TableCell>

              <TableCell className="text-muted-foreground">
                Je suis de la description
              </TableCell>

              <TableCell>50</TableCell>

              <TableCell className="text-muted-foreground">
                {new Date().toLocaleDateString()}
              </TableCell>

              <TableCell className="flex items-center gap-x-3">
                <CategoryModal
                  dialogTitle="Modifier"
                  dialogDescription="Modifier le nom de la catégorie"
                  dialogButton={
                    <Button className="w-fit">
                      <Pen />
                    </Button>
                  }
                  form={
                    <UpdateCategoryForm
                      category={{
                        id: category.id,
                        categoryName: category.categoryName,
                      }}
                    />
                  }
                />

                <Button className="w-fit">
                  <Trash />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CategoriesList;
