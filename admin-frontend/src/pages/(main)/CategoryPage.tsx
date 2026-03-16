import { AuthenticatedLayout } from '@/components/AuthenticatedLayout';

const CategoryPage = () => {
  return (
    <AuthenticatedLayout
      pageContent={<p>CategoryPage</p>}
    ></AuthenticatedLayout>
  );
};

export default CategoryPage;
