import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";
import { useQuery } from "@tanstack/react-query";
import { getCategoriesApi } from "@/features/categories/api/get-categories-api";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { FETCH_KEYS } from "@/types/fetch-key-type";
import { useState } from "react";

import CreateCategoryForm from "@/features/categories/components/CreateCategoryForm";
import CategoriesList from "@/features/categories/components/CategoriesList";
import CategoryModal from "@/features/categories/components/CategoryModal";

const CategoryPage = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const { isLoading, error, data } = useQuery({
    queryKey: [FETCH_KEYS.CATEGORY],
    queryFn: getCategoriesApi,
  });

  if (error || data === undefined) return <p>error</p>;

  return (
    <AuthenticatedLayout>
      <div className="flex flex-col gap-y-4">
        <div className="flex items-center justify-between">
          <h1>Catégories</h1>
          <CategoryModal
            setIsOpen={() => setIsOpen((prev) => !prev)}
            isOpen={isOpen}
            dialogButton={
              <Button>
                <PlusIcon />
                Ajouter une catégorie
              </Button>
            }
            form={<CreateCategoryForm closeModal={() => setIsOpen(false)} />}
            dialogTitle="Nouvelle catégorie"
            dialogDescription="Ajouter une nouvelle catégorie de ressource"
          />
        </div>

        <CategoriesList isLoading={isLoading} categories={data} />
      </div>
    </AuthenticatedLayout>
  );
};

export default CategoryPage;
