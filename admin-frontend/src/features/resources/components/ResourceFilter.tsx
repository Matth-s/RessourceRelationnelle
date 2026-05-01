import { Button } from "@/components/ui/button";
import type { IPublicationResource } from "@/types/resource-type";
import type { resourceArrayType } from "../schemas/ressource-schema";
import {
  formatPublicationStatus,
  getResourceLengthByType,
} from "../helpers/resource-helper";

type ResourceFilterProps = {
  onChangeFilter: (filter?: IPublicationResource) => void;
  filters: IPublicationResource[];
  selectedModerationStatus?: IPublicationResource;
  resources: resourceArrayType;
};

const ResourceFilter = ({
  onChangeFilter,
  resources,
  filters,
  selectedModerationStatus,
}: ResourceFilterProps) => {
  const allFilters = [undefined, ...filters];

  return (
    <div className="mb-4 flex w-fit overflow-hidden rounded-sm">
      {allFilters.map((filter) => {
        const resourceLength = getResourceLengthByType({
          data: resources,
          publicationStatus: filter,
        });

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
            <p>{filter ? formatPublicationStatus(filter) : "Total"}</p>
            <span>{resourceLength}</span>
          </Button>
        );
      })}
    </div>
  );
};

export default ResourceFilter;
