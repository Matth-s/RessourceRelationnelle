import { Button } from "@/components/ui/button";
import { Link } from "react-router";

type FormNavigationButton = {
  to: string;
  text: string;
};

export const FormNavigateButton = ({ to, text }: FormNavigationButton) => {
  return (
    <Button
      variant="outline"
      className="w-full border-black bg-transparent text-black hover:bg-black hover:text-white"
    >
      <Link to={`/auth/${to}`}>{text}</Link>
    </Button>
  );
};
