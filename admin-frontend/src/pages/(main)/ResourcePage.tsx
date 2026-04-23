import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";
import { Outlet } from "react-router";

const ResourcePage = () => {
  return (
    <AuthenticatedLayout>
      <Outlet />
    </AuthenticatedLayout>
  );
};

export default ResourcePage;
