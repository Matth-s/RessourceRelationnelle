import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import UserCard from "./UserCard";
import { USER_TABLE_HEADER } from "../constants/user-constant";
import type { usersSchemaType } from "../schemas/users-schema";
import TrSkeleton from "@/components/skeletons/TrSkeleton";

type UsersListProps = {
  isLoading: boolean;
  error: Error | null;
  users: usersSchemaType;
};

const UsersList = ({ isLoading, error, users }: UsersListProps) => {
  return (
    <div className="bg-muted/40 mx-auto w-[90%] overflow-hidden rounded-xl border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/60">
            {USER_TABLE_HEADER.map((header) => (
              <TableHead
                key={header.name}
                className="text-muted-foreground text-center text-sm font-semibold"
              >
                {header.name}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {isLoading ? (
            <TrSkeleton />
          ) : error ? (
            <TableRow>
              <TableCell colSpan={12} className="text-center">
                Une erreur est survenue
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => <UserCard key={user.id} user={user} />)
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default UsersList;
