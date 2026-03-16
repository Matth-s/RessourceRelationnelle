import { useQuery } from "@tanstack/react-query";
import { getDashBoardStatsApi } from "../api/get-dashboard-stats-api";
import DashboardStatCard from "./DashboardStatCard";

const DashboardStatsList = () => {
  const { isLoading, error, data } = useQuery({
    queryFn: getDashBoardStatsApi,
    queryKey: ["dashboard-stats"],
  });

  if (isLoading) {
    return <p>Skeleton</p>;
  }

  if (error) return <p>Une erreur est survenue</p>;

  return (
    <div>
      {!data ? (
        <p>Aucunes données a afficher</p>
      ) : (
        <div className="flex gap-x-4">
          {data.map((stat) => (
            <DashboardStatCard key={stat.key} stat={stat} />
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardStatsList;
