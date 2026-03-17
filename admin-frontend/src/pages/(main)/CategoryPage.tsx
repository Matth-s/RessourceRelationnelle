import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";
import { useQuery } from "@tanstack/react-query";
import { getCategoriesApi } from "@/features/categories/api/get-categories-api";

import CategoriesList from "@/features/categories/components/CategoriesList";
import CategoryModal from "@/features/categories/components/CategoryModal";
import { Button } from "@/components/ui/button";
import CreateCategoryForm from "@/features/categories/components/CreateCategoryForm";
import { PlusIcon } from "lucide-react";

const CategoryPage = () => {
  const { isLoading, error, data } = useQuery({
    queryKey: [],
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
