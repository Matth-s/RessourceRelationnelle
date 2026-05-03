import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { useState } from "react";

import CreateCategoryForm from "@/features/categories/components/CreateCategoryForm";
import CategoriesList from "@/features/categories/components/CategoriesList";
import CategoryModal from "@/features/categories/components/CategoryModal";
import { useGetCategories } from "@/features/categories/hooks/use-get-categories";

const CategoryPage = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const { isLoading, error, data = [], refetch } = useGetCategories();

  return (
    <AuthenticatedLayout>
      <div className="flex h-full flex-col gap-y-4">
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

        <CategoriesList
          isLoading={isLoading}
          categories={data}
          error={error}
          refetch={refetch}
        />
      </div>
    </AuthenticatedLayout>
  );
};

export default CategoryPage;
