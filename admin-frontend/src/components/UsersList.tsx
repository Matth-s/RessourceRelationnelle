import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import UserCard from "../features/user/components/UserCard";
import { USER_TABLE_HEADER } from "../features/user/constants/user-constant";
import type { usersSchemaType } from "../features/user/schemas/users-schema";
import CardFetchError from "@/components/CardFetchError";

type UsersListProps = {
  isLoading: boolean;
  error: Error | null;
  users: usersSchemaType;
  refetch: () => void;
};

const UsersList = ({ isLoading, error, users, refetch }: UsersListProps) => {
  if (isLoading) return <p>chargement</p>;

  if (error) return <CardFetchError onRetry={refetch} />;

  return (
    <div className="bg-muted/40 w-full overflow-hidden rounded-xl border">
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
          {users.map((user) => (
            <UserCard key={user.id} user={user} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default UsersList;
