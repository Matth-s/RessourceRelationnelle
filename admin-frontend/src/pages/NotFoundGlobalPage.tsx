import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { NavLink } from "react-router";

const NotFoundGlobalPage = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Page non trouvée</CardTitle>
        <CardDescription aria-describedby="undefined"></CardDescription>
      </CardHeader>

      <NavLink to={"/"}>Revenir à la connexion</NavLink>
    </Card>
  );
};

export default NotFoundGlobalPage;
