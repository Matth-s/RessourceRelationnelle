import { Card, CardContent } from "@/components/ui/card";
import type { IDashboardStatSchema } from "../schemas/dashboard-schema";
import { TrendingUp } from "lucide-react";

import iconText from "@/assets/category-icon.svg";

type DashboardStatCardProps = {
  stat: IDashboardStatSchema;
};

const DashboardStatCard = ({ stat }: DashboardStatCardProps) => {
  const { name, value, augmentation } = stat;

  return (
    <Card className="w-1/4 rounded-xl">
      <CardContent className="flex items-center justify-between p-3">
        <div className="space-y-1">
          <p className="text-xs font-medium text-gray-500">{name}</p>

          <p className="text-2xl font-semibold">{value}</p>

          <div className="flex items-center gap-1 text-xs text-gray-500">
            <TrendingUp className="h-3 w-3" />
            <span>+{augmentation}%</span>
          </div>
        </div>

        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100">
          <img src={iconText} alt="icon" className="h-4 w-4" />
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardStatCard;
