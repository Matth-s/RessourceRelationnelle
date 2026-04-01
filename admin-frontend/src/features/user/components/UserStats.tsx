import type { usersSchemaType } from "../schemas/users-schema";
import { createUserStats } from "../helpers/user-helpers";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type UserStatsProps = {
  error: Error | null;
  isLoading: boolean;
  data: usersSchemaType;
};

const UserStats = ({ error, isLoading, data }: UserStatsProps) => {
  if (isLoading) return <p>fetch data</p>;

  if (error) return null;

  const formattedData = createUserStats(data);

  return (
    <div className="flex items-center gap-8">
      {formattedData.map((stat) => (
        <Card key={stat.title} className="w-full">
          <CardHeader className="text-center">
            <CardTitle>{stat.title}</CardTitle>
            <CardDescription>{stat.value}</CardDescription>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
};

export default UserStats;
