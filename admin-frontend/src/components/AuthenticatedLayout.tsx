import Aside from "./Aside";
import PageHeader from "./PageHeader";

type AuthenticatedLayoutProps = {
  children: React.ReactNode;
};

export const AuthenticatedLayout = ({ children }: AuthenticatedLayoutProps) => {
  return (
    <div className="flex h-full">
      <div className="w-1/5">
        <Aside />
      </div>
      <div className="flex h-full w-4/5 flex-col">
        <PageHeader />
        <div className="h-full bg-gray-100 p-8">{children}</div>
      </div>
    </div>
  );
};
