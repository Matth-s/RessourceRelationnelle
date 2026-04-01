import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

type CardFetchErrorProps = {
  onRetry: () => void;
};

const CardFetchError = ({ onRetry }: CardFetchErrorProps) => {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <Card className="m-auto w-xs text-center">
        <CardHeader>
          <CardTitle>Une erreur est survenue</CardTitle>
          <CardDescription>Impossible de charger les données.</CardDescription>

          <Button onClick={onRetry} className="mt-4">
            Réessayer
          </Button>
        </CardHeader>
      </Card>
    </div>
  );
};

export default CardFetchError;
