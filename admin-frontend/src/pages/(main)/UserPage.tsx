import { AuthenticatedLayout } from '@/components/AuthenticatedLayout';

const UserPage = () => {
  return (
    <AuthenticatedLayout
      pageContent={<p>UserPage</p>}
    ></AuthenticatedLayout>
  );
};

export default UserPage;
