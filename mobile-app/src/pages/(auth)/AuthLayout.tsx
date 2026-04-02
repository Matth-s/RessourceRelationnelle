import { Outlet } from "react-router";

const AuthLayout = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <Outlet />
    </div>
  );
};

export default AuthLayout;
