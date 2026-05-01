import { Button } from "./ui/button";

type SubmitButtonProps = {
  isDisabled: boolean;
  text: string;
  className?: string;
  variant?:
    | "link"
    | "default"
    | "outline"
    | "secondary"
    | "ghost"
    | "destructive";
};

const SubmitButton = ({
  isDisabled,
  text,
  className,
  variant,
}: SubmitButtonProps) => {
  return (
    <Button
      className={className}
      disabled={isDisabled}
      variant={variant}
      type="submit"
    >
      {text}
    </Button>
  );
};

export default SubmitButton;
