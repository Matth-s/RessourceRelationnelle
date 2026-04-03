import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useState } from "react";
import type { IUserRole } from "@/types/user-type";
import { ChevronDown } from "lucide-react";
import { formatRole } from "@/helpers/format-role-name";
import { cn } from "@/lib/utils";

type RoleCollapsibleProps = {
  userRole: IUserRole[];
};

const RoleCollapsible = ({ userRole }: RoleCollapsibleProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const showImg = userRole.length > 1;

  return (
    <DropdownMenu
      open={isOpen}
      onOpenChange={() => {
        if (showImg) {
          setIsOpen((prev) => !prev);
        }
      }}
    >
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          disabled={!showImg}
          className={cn(
            "mx-auto flex justify-between border-none bg-transparent shadow-none outline-none",
            !showImg && "cursor-default",
          )}
        >
          <span className="truncate">{formatRole(userRole[0])}</span>
          {showImg ? (
            <ChevronDown
              className={`ml-2 h-4 w-4 transition-transform ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          ) : null}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          {userRole.map((role) => (
            <DropdownMenuLabel key={role}>{formatRole(role)}</DropdownMenuLabel>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default RoleCollapsible;
