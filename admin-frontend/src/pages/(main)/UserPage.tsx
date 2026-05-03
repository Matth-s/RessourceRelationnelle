import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";
import { useUsers } from "@/features/user/hooks/use-users";

import HeaderUserPage from "@/features/user/components/HeaderUserPage";
import UsersList from "@/features/user/components/UsersList";
import UserStats from "@/features/user/components/UserStats";

const UserPage = () => {
  const { isPending, error, data, refetch } = useUsers();

  return (
    <AuthenticatedLayout>
      <div className="flex h-full min-h-full flex-col gap-y-4">
        <HeaderUserPage />

        <UserStats error={error} data={data} />

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
