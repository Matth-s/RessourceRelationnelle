import { Button } from "@/components/ui/button";
import type { IPublicationResource } from "@/types/resource-type";

type ResourceFilterProps = {
  onChangeFilter: (filter?: IPublicationResource) => void;
  filters: IPublicationResource[];
  selectedModerationStatus?: IPublicationResource;
  resourceLength: number;
};

const ResourceFilter = ({
  onChangeFilter,
  resourceLength,
  filters,
  selectedModerationStatus,
}: ResourceFilterProps) => {
  const allFilters = [undefined, ...filters];

  return (
    <div className="flex w-fit overflow-hidden rounded-sm">
      {allFilters.map((filter) => {
        const isSelected =
          filter === undefined
            ? selectedModerationStatus === undefined
            : selectedModerationStatus === filter;

        return (
          <Button
            key={filter ?? "total"}
            variant={isSelected ? "default" : "outline"}
            onClick={() => onChangeFilter(filter)}
            className="h-16 rounded-none px-8"
          >
            <p>{filter ?? "Total"}</p>
            <span>{resourceLength}</span>
          </Button>
        );
      })}
    </div>
  );
};

export default ResourceFilter;
