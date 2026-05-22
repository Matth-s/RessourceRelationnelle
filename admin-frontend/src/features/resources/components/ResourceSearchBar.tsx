import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useDebouncedCallback } from "use-debounce";

type ResourceSearchBarProps = {
  defaultValue: string;
  setSearchText: (value: string) => void;
};

const ResourceSearchBar = ({
  defaultValue,
  setSearchText,
}: ResourceSearchBarProps) => {
  const debounced = useDebouncedCallback((value) => {
    setSearchText(value.trim());
  }, 200);

  return (
    <div className="mr-auto flex w-96 items-center gap-3">
      <Input
        className="bg-white text-black"
        defaultValue={defaultValue}
        placeholder="Rechercher une ressource"
        onChange={(e) => debounced(e.target.value)}
        aria-label="searchResource"
      />

      <Search />
    </div>
  );
};

export default ResourceSearchBar;
