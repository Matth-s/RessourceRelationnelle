import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";
import { getUsersApi } from "@/features/user/api/get-users-api";
import UsersList from "@/features/user/components/UsersList";
import { FETCH_KEYS } from "@/types/fetch-key-type";
import { useQuery } from "@tanstack/react-query";

const UserPage = () => {
  const { isPending, error, data } = useQuery({
    queryKey: [FETCH_KEYS.USERS],
    queryFn: getUsersApi,
  });

  return (
    <AuthenticatedLayout
      pageContent={
        <UsersList isLoading={isPending} error={error} users={data ?? []} />
      }
    ></AuthenticatedLayout>
  );
};

export default UserPage;
