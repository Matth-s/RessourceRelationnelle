import Aside from "./Aside";
import PageHeader from "./PageHeader";

type AuthenticatedLayoutProps = {
  pageContent: React.ReactNode;
};

export const AuthenticatedLayout = ({
  pageContent,
}: AuthenticatedLayoutProps) => {
  return (
    <div className="flex h-full">
      <div className="w-1/5">
        <Aside />
      </div>
      <div className="h-full w-4/5">
        <PageHeader />

        <div className="h-full bg-gray-100 p-2">{pageContent}</div>
      </div>
    </div>
  );
};
