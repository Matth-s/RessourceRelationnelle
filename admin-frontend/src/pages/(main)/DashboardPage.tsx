import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";
import StatsDashboard from "@/features/statistics/components/StatsDashboard";

const DashboardPage = () => {
  return (
    <AuthenticatedLayout>
      <StatsDashboard />
    </AuthenticatedLayout>
  );
};

export default DashboardPage;
