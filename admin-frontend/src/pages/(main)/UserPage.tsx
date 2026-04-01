import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";
import { getUsersApi } from "@/features/user/api/get-users-api";
import HeaderUserPage from "@/features/user/components/HeaderUserPage";
import UsersList from "@/features/user/components/UsersList";
import UserStats from "@/features/user/components/UserStats";
import { FETCH_KEYS } from "@/types/fetch-key-type";
import { useQuery } from "@tanstack/react-query";

const UserPage = () => {
  const {
    isPending,
    error,
    data = [],
    refetch,
  } = useQuery({
    queryKey: [FETCH_KEYS.USERS],
    queryFn: getUsersApi,
    retry: false,
  });

  return (
    <AuthenticatedLayout>
      <div className="flex h-full flex-col gap-y-4">
        <HeaderUserPage />

        <UserStats isLoading={isPending} error={error} data={data} />

        <UsersList
          refetch={refetch}
          isLoading={isPending}
          error={error}
          users={data}
        />
      </div>
    </AuthenticatedLayout>
  );
};

export default UserPage;
