import { cn } from "@/lib/utils";
import { Link } from "react-router";

type FormSuccessMessageProps = {
  message?: string;
  className?: string;
  link?: string;
  linkTexte?: string;
};

const FormSuccessMessage = ({
  message,
  className,
  link,
  linkTexte,
}: FormSuccessMessageProps) => {
  if (!message) return null;

  return (
    <div
      className={cn(
        "rounded-lg border border-green-300 bg-green-100 px-4 py-2 text-center text-sm font-semibold text-green-700 shadow-md",
        className,
      )}
    >
      {message}
      <Link className="text-blue-500 underline" to={"/auth/" + link || "/"}>
        {linkTexte}
      </Link>
    </div>
  );
};

export default FormSuccessMessage;
