import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import type { categoriesArrayType } from "../schemas/categories-schema";
import { CATEGORIES_HEADER_TABLE } from "../constants/categories-constant";

import CategoryCard from "./CategoryCard";

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
            <CategoryCard key={category.id} category={category} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CategoriesList;
