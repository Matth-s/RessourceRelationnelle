import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { USER_ROLE_CONSTANT } from "@/constants/user-constant";
import type { IStatusParams, IUserRole } from "@/types/user-type";

type UserFilterProps = {
  setFilter: React.Dispatch<
    React.SetStateAction<{
      rolesParams: IUserRole[];
      statusParams: IStatusParams | undefined;
      search: string;
    }>
  >;

  filters: {
    rolesParams: IUserRole[];
    statusParams: IStatusParams | undefined;
    search: string;
  };
};

const UserFilter = ({ filters, setFilter }: UserFilterProps) => {
  const { search } = filters;

  return (
    <div className="flex gap-x-8">
      <Input
        defaultValue={search}
        onChange={(e) =>
          setFilter((prev) => {
            return {
              ...prev,
              search: e.target.value,
            };
          })
        }
      />
      <Select
        onValueChange={(e: IUserRole) => {
          setFilter((prev) => {
            return {
              ...prev,
              rolesParams: [...prev.rolesParams, e],
            };
          });
        }}
      >
        <SelectTrigger>Role</SelectTrigger>
        <SelectContent>
          {USER_ROLE_CONSTANT.map((role) => (
            <SelectItem key={role.value} value={role.value}>
              {role.value}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        onValueChange={(e: IStatusParams) => {
          setFilter((prev) => {
            return {
              ...prev,
              statusParams: e,
            };
          });
        }}
      >
        <SelectTrigger>Status</SelectTrigger>
        <SelectContent>
          <SelectItem value="active">Actif</SelectItem>
          <SelectItem value="inactive">Non actif</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default UserFilter;
