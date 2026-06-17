import { useAppDispatch, useAppSelector } from "@/store/hook";
import { useLocation } from "react-router";
import { formatCurrentLocation } from "@/helpers/format-current-location";
import { ChevronLeft, Menu } from "lucide-react";

import RoleCollapsible from "./RoleCollapsible";
import { toggleAside } from "@/store/slices/aside-slice";

type PageHeaderProps = {
  isOpen : boolean
}

const PageHeader = ({  isOpen }: PageHeaderProps) => {
  const dispatch = useAppDispatch();
  const { pathname } = useLocation();
  const user = useAppSelector((state) => state.auth.user);

  if (!user) return null;

  return (
    <div className="flex h-16 items-center border-b bg-white px-6">
      <button onClick={() => dispatch(toggleAside())} className="mr-2">
        {isOpen ? <ChevronLeft /> : <Menu />}
      </button>
      <p className="text-lg font-semibold">{formatCurrentLocation(pathname)}</p>

      <div className="flex flex-col items-start ml-auto">
        <p className="text-sm font-semibold text-gray-900">{user.username}</p>

        <p className="text-sm text-gray-500">
          <RoleCollapsible userRole={user.role} />
        </p>
      </div>
    </div>
  );
};

export default PageHeader;
