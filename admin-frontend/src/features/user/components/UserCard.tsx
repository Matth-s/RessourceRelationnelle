import { TableCell, TableRow } from "@/components/ui/table";
import type { userSchemaType } from "../schemas/users-schema";
import UpdateUserForm from "./UpdateUserForm";
import DeleteUserForm from "./DeleteUserForm";
import RoleCollapsible from "@/components/RoleCollapsible";

type UserCardProps = {
  user: userSchemaType;
};

const UserCard = ({ user }: UserCardProps) => {
  const { username, email, createdAt, role } = user;

  return (
    <TableRow className="text-center">
      <TableCell>{email}</TableCell>
      <TableCell>{username}</TableCell>
      <TableCell>
        <RoleCollapsible userRole={role} />
      </TableCell>
      <TableCell>{createdAt.toLocaleDateString()}</TableCell>
      <TableCell className="flex justify-center gap-x-1">
        <UpdateUserForm user={user} />
        <DeleteUserForm user={user} />
      </TableCell>
    </TableRow>
  );
};

export default UserCard;
