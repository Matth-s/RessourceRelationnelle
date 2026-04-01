import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { USER_ROLE_CONSTANT } from "@/constants/user-constant";
import type { IUserRole } from "@/types/user-role-type";

type SelectFormRoleProps = {
  role: IUserRole;
  onChange: (value: IUserRole) => void;
};

const SelectFormRole = ({ role, onChange }: SelectFormRoleProps) => {
  return (
    <Select
      value={role}
      onValueChange={(p) => {
        if (p === null) return;

        onChange(p);
      }}
    >
      <SelectTrigger>
        <SelectValue placeholder="Role de l'utilisateur" />
      </SelectTrigger>
      <SelectContent>
        {USER_ROLE_CONSTANT.map((item) => (
          <SelectItem key={item.value} value={item.value}>
            {item.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default SelectFormRole;
