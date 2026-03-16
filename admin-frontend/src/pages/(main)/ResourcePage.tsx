import { AuthenticatedLayout } from '@/components/AuthenticatedLayout';

const ResourcePage = () => {
  return (
    <AuthenticatedLayout
      pageContent={<p>ResourcePage</p>}
    ></AuthenticatedLayout>
  );
};

export default ResourcePage;
