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
import CardFetchError from "@/components/CardFetchError";

type CategoriesListProps = {
  categories: categoriesArrayType;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
};

const CategoriesList = ({
  categories,
  isLoading,
  error,
  refetch,
}: CategoriesListProps) => {
  if (isLoading) {
    return <p>Chargement...</p>;
  }

  if (error) return <CardFetchError onRetry={refetch} />;

  return (
    <div className="bg-muted/40 mx-auto w-full overflow-hidden rounded-xl border">
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
