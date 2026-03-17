import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";
import { useQuery } from "@tanstack/react-query";
import { getCategoriesApi } from "@/features/categories/api/get-categories-api";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { FETCH_KEYS } from "@/types/fetch-key-type";

import CreateCategoryForm from "@/features/categories/components/CreateCategoryForm";
import CategoriesList from "@/features/categories/components/CategoriesList";
import CategoryModal from "@/features/categories/components/CategoryModal";

const CategoryPage = () => {
  const { isLoading, error, data } = useQuery({
    queryKey: [FETCH_KEYS.CATEGORY],
    queryFn: getCategoriesApi,
  });

  if (error || data === undefined) return <p>error</p>;

  return (
    <AuthenticatedLayout
      pageContent={
        <>
          <div className="flex items-center justify-between">
            <h1>Catégories</h1>
            <CategoryModal
              dialogButton={
                <Button>
                  <PlusIcon />
                  Ajouter une catégorie
                </Button>
              }
              form={<CreateCategoryForm />}
              dialogTitle="Nouvelle catégorie"
              dialogDescription="Ajouter une nouvelle catégorie de ressource"
            />
          </div>

          <CategoriesList isLoading={isLoading} categories={data} />
        </>
      }
    ></AuthenticatedLayout>
  );
};

export default CategoryPage;
