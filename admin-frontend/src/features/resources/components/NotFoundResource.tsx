import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { NavLink } from "react-router";

const NotFoundResource = () => {
  return (
    <div className="flex h-full items-center justify-center">
      <Card className="w-xs">
        <CardHeader className="text-center">
          <CardTitle>
            Il semblerait que cette ressource n'existe pas ou a été supprimée.
          </CardTitle>
          <CardDescription className="mt-4">
            <NavLink to={"/ressources"}>
              <Button>Revenir à la liste des ressources</Button>
            </NavLink>
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
};

export default NotFoundResource;
