import { AuthenticatedLayout } from '@/components/AuthenticatedLayout';
import DashboardStatsList from '@/features/dashboard/components/DashboardStatsList';

const DashboardPage = () => {
  return (
    <AuthenticatedLayout
      pageContent={
        <div>
          <DashboardStatsList />
        </div>
      }
    ></AuthenticatedLayout>
  );
};

export default DashboardPage;
