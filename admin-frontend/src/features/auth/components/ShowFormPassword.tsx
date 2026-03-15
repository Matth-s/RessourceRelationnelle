import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

type ShowFormPasswordProps = {
  text: string;
  showPassword: boolean;
  onClick: () => void;
};

const ShowFormPassword = ({
  text,
  showPassword,
  onClick,
}: ShowFormPasswordProps) => {
  return (
    <div className="flex items-center gap-x-1.5">
      <Checkbox
        id="show"
        defaultChecked={showPassword}
        onCheckedChange={onClick}
      />

      <Label htmlFor="show">{text}</Label>
    </div>
  );
};

export default ShowFormPassword;
