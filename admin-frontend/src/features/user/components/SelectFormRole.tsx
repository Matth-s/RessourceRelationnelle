import { MultiSelect } from "@/components/ui/mutil-select";
import { USER_ROLE_CONSTANT } from "@/constants/user-constant";
import type { IUserRole } from "@/types/user-type";

type SelectFormRoleProps = {
  value: IUserRole[];
  onChange: (value: IUserRole[]) => void;
};

const SelectFormRole = ({ value, onChange }: SelectFormRoleProps) => {
  return (
    <MultiSelect
      options={USER_ROLE_CONSTANT}
      onValueChange={(e) => onChange(e as IUserRole[])}
      defaultValue={value}
      searchable={false}
      hideSelectAll
      animation={0}
      maxCount={5}
      placeholder="Choisissez des roles"
    />
  );
};

export default SelectFormRole;
