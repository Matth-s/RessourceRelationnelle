import { AuthenticatedLayout } from '@/components/AuthenticatedLayout';

const StatsPage = () => {
  return (
    <AuthenticatedLayout
      pageContent={<p>StatsPage</p>}
    ></AuthenticatedLayout>
  );
};

export default StatsPage;
