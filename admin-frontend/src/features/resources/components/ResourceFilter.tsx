import type { IPublicationResource } from "@/types/resource-type";
import type { resourceArrayType } from "../schemas/ressource-schema";
import {
  formatPublicationStatus,
  getResourceLengthByType,
} from "../helpers/resource-helper";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

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
    <Select
      value={selectedModerationStatus ?? "total"}
      onValueChange={(value) => {
        onChangeFilter(
          value === "total" ? undefined : (value as IPublicationResource),
        );
      }}
    >
      <SelectTrigger className="bg-white">
        <SelectValue placeholder="Filtrer" />
      </SelectTrigger>

      <SelectContent>
        {allFilters.map((filter) => {
          const resourceLength = getResourceLengthByType({
            data: resources,
            publicationStatus: filter,
          });

          const value = filter ?? "total";

          return (
            <SelectItem key={value} value={value}>
              {filter ? formatPublicationStatus(filter) : "Total"} (
              {resourceLength})
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
};

export default ResourceFilter;
