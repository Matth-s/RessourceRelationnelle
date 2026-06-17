import { Button } from "./ui/button";

type SubmitButtonProps = {
  isLoading: boolean;
  text: string;
};
const SubmitButton = ({ isLoading, text }: SubmitButtonProps) => {
  return (
    <Button disabled={isLoading} type="submit">
      {text}
    </Button>
  );
};

export default SubmitButton;
