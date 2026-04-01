import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type SelectActiveFormProps = {
  isActive: boolean;
  onChange: (value: boolean) => void;
};

const SelectActiveForm = ({ isActive, onChange }: SelectActiveFormProps) => {
  return (
    <Select
      value={isActive ? "true" : "false"}
      onValueChange={(value) => {
        onChange(value === "true");
      }}
    >
      <SelectTrigger>
        <SelectValue placeholder="Etat de l'utilisateur" />
      </SelectTrigger>

      <SelectContent>
        <SelectItem value="true">Actif</SelectItem>
        <SelectItem value="false">Suspendu</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default SelectActiveForm;
