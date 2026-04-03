import { useEffect, useState } from "react";
import { getStatisticsApi } from "../api/get-statistics-api";
import type { PieLabelRenderProps } from "recharts";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const COLORS = [
  "#2563eb",
  "#7c3aed",
  "#db2777",
  "#ea580c",
  "#16a34a",
  "#0891b2",
  "#4f46e5",
  "#c026d3",
  "#d97706",
  "#059669",
];

type StatsData = {
  totals: {
    users: number;
    resources: number;
    comments: number;
    events: number;
  };
  usersByZone: { zone: string; count: number }[];
  topFavorites: { title: string; count: number }[];
  topBookmarked: { title: string; count: number }[];
};

const StatsDashboard = () => {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getStatisticsApi();
        setStats(data);
      } catch {
        setError("Erreur lors du chargement des statistiques");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <p className="text-gray-500">Chargement...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!stats) return null;

  return (
    <div className="space-y-8">
      {/* Cartes de totaux */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <TotalCard label="Utilisateurs" value={stats.totals.users} />
        <TotalCard label="Ressources" value={stats.totals.resources} />
        <TotalCard label="Commentaires" value={stats.totals.comments} />
        <TotalCard label="Événements" value={stats.totals.events} />
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Répartition par zone géographique */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">
            Répartition des utilisateurs par zone géographique
          </h3>
          {stats.usersByZone.length > 0 ? (
            <ResponsiveContainer width="100%" height={420}>
              <PieChart>
                <Pie
                  data={stats.usersByZone}
                  dataKey="count"
                  nameKey="zone"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={(props: PieLabelRenderProps) => {
                    const RADIAN = Math.PI / 180;
                    const cx = Number(props.cx ?? 0);
                    const cy = Number(props.cy ?? 0);
                    const midAngle = Number(props.midAngle ?? 0);
                    const outerRadius = Number(props.outerRadius ?? 0);
                    const name = String(props.name ?? "");
                    const value = Number(props.value ?? 0);

                    const radius = outerRadius + 30;
                    const x = cx + radius * Math.cos(-midAngle * RADIAN);
                    const y = cy + radius * Math.sin(-midAngle * RADIAN);

                    return (
                        <text
                        x={x}
                        y={y}
                        textAnchor={x > cx ? "start" : "end"}
                        dominantBaseline="central"
                        fontSize={12}
                        >
                        {`${name} (${value})`}
                        </text>
                    );
                    }}
                  labelLine={true}
                >
                  {stats.usersByZone.map((_, index) => (
                    <Cell
                      key={`zone-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-400">Aucune donnée disponible</p>
          )}
        </div>

        {/* Ressources les plus mises en favori */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">
            Ressources les plus mises en favori
          </h3>
          {stats.topFavorites.length > 0 ? (
            <ResponsiveContainer width="100%" height={350}>
              <BarChart
                data={stats.topFavorites}
                layout="vertical"
                margin={{ left: 20, right: 20, top: 5, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" allowDecimals={false} />
                <YAxis
                  type="category"
                  dataKey="title"
                  width={200}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip />
                <Bar dataKey="count" fill="#2563eb" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-400">Aucune donnée disponible</p>
          )}
        </div>

        {/* Ressources les plus bookmarkées */}
        <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4">
            Ressources les plus bookmarkées
          </h3>
          {stats.topBookmarked.length > 0 ? (
            <ResponsiveContainer width="100%" height={390}>
              <BarChart
                data={stats.topBookmarked}
                margin={{ left: 40, right: 20, top: 30, bottom: 150 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="title"
                  angle={-35}
                  textAnchor="end"
                  tick={{ fontSize: 11 }}
                  interval={0}
                />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#7c3aed" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-400">Aucune donnée disponible</p>
          )}
        </div>
      </div>
    </div>
  );
};

const TotalCard = ({ label, value }: { label: string; value: number }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <p className="text-sm text-gray-500">{label}</p>
    <p className="text-3xl font-bold mt-1">{value}</p>
  </div>
);

export default StatsDashboard;