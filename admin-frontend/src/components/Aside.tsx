import { HEADER_LINKS_CONSTANT } from "@/constants/header-links-constant";
import { useAppSelector } from "@/store/hook";
import { NavLink } from "react-router";
import LogoutButton from "./LogoutButton";

const Aside = () => {
  const user = useAppSelector((state) => state.auth.user);

  if (!user) return;

  return (
    <aside className="fixed left-0 flex h-screen w-full max-w-1/5 flex-col justify-between bg-gray-900">
      <nav className="p-3">
        <ul className="flex flex-col gap-y-2">
          {HEADER_LINKS_CONSTANT.map((link) => (
            <li
              key={link.name}
              className="flex h-10 w-full items-center rounded-sm text-gray-400 hover:bg-gray-800 hover:text-white"
            >
              <NavLink
                to={link.path}
                className={({ isActive }) =>
                  `flex h-full w-full items-center gap-x-2 p-2 transition-colors ${isActive ? "text-white" : "text-gray-400 hover:text-white"}`
                }
              >
                {({ isActive }) => (
                  <>
                    <img
                      src={link.icon}
                      alt={link.name}
                      className={`h-5 w-5 ${isActive ? "invert filter" : "opacity-30 invert"}`}
                    />
                    {link.name}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="w-full border-t-2 border-gray-600 p-3">
        <LogoutButton />
      </div>
    </aside>
  );
};

export default Aside;
