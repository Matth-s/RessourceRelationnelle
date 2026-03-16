import { Button } from "./ui/button";

type SubmitButtonProps = {
  isDisabled: boolean;
  text: string;
  className?: string;
};

const SubmitButton = ({ isDisabled, text, className }: SubmitButtonProps) => {
  return (
    <Button className={className} disabled={isDisabled}>
      {text}
    </Button>
  );
};

export default SubmitButton;
