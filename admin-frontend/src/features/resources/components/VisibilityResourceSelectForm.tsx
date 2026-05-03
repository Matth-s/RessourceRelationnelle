import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { VISIBILITY_FORM } from "../constant/resource-constant";

type VisibilityResourceSelectFormProps = {
  value: boolean;
  onChange: (value: boolean) => void;
  className?: string;
};

const VisibilityResourceSelectForm = ({
  value,
  onChange,
  className,
}: VisibilityResourceSelectFormProps) => {
  return (
    <Select
      value={value.toString()}
      onValueChange={(val) => onChange(val === "true")}
    >
      <SelectTrigger className={className}>
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {VISIBILITY_FORM.map((item) => (
            <SelectItem key={item.label} value={item.value.toString()}>
              {item.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
export default VisibilityResourceSelectForm;
