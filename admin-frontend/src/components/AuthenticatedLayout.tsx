 
import Aside from "./Aside";
import PageHeader from "./PageHeader";

import { cn } from "@/lib/utils";
import { useAppSelector } from "@/store/hook";

type AuthenticatedLayoutProps = {
  children: React.ReactNode;
};

export const AuthenticatedLayout = ({ children }: AuthenticatedLayoutProps) => {
  const {isOpen} = useAppSelector((state) => state.aside); 

  return (
    <div className="flex min-h-full">
      {
        isOpen && 
        (<div className="w-1/5">
          <Aside />
        </div>)
      }      
      <div className={cn("flex min-h-full flex-col",
        isOpen ? "w-4/5" : "w-full"
      )}>
        <PageHeader isOpen={isOpen} />
        <div className="h-full bg-gray-100 p-8">{children}</div>
      </div>
    </div>
  );
};
