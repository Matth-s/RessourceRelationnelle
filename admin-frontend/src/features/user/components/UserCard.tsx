import { TableCell, TableRow } from "@/components/ui/table";
import type { userSchemaType } from "../schemas/users-schema";
import DeleteUserForm from "./DeleteUserForm";

type UserCardProps = {
  user: userSchemaType;
};

const UserCard = ({ user }: UserCardProps) => {
  const { username, email, createdAt, role } = user;

  return (
    <TableRow>
      <TableCell>{email}</TableCell>
      <TableCell>{username}</TableCell>
      <TableCell>{createdAt.toDateString()}</TableCell>
      <TableCell>{role}</TableCell>
      <TableCell>
        <DeleteUserForm user={user} />
      </TableCell>
    </TableRow>
  );
};

export default UserCard;
