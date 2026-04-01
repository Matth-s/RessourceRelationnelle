import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

const CategoryError = ({ onRetry }: { onRetry: () => void }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Une erreur est survenue</CardTitle>
        <CardDescription>Impossible de charger les données.</CardDescription>

        <Button onClick={onRetry}>Réessayer</Button>
      </CardHeader>
    </Card>
  );
};

export default CategoryError;
