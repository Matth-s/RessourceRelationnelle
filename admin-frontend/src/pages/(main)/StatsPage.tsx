import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";
import StatsDashboard from "@/features/statistics/components/StatsDashboard";

const StatsPage = () => {
  return (
    <AuthenticatedLayout>
      <StatsDashboard />
    </AuthenticatedLayout>
  );
};

export default StatsPage;
