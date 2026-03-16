import { useAppSelector } from "@/store/hook";
import { useLocation } from "react-router";
import { formatCurrentLocation } from "@/helpers/format-current-location";

const PageHeader = () => {
  const { pathname } = useLocation();
  const user = useAppSelector((state) => state.auth.user);

  if (!user) return null;

  return (
    <div className="flex h-16 items-center justify-between border-b bg-white px-6">
      <p className="text-lg font-semibold">{formatCurrentLocation(pathname)}</p>

      <div className="flex flex-col items-start">
        <p className="text-sm font-semibold text-gray-900">{user.username}</p>

        <p className="text-sm text-gray-500">{user.role}</p>
      </div>
    </div>
  );
};

export default PageHeader;
