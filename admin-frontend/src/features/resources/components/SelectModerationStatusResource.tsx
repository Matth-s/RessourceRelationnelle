import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { IPublicationResource } from "@/types/resource-type";
import { MODERATION_STATUS_RESOURCE } from "../constant/resource-constant";

type SelectModerationStatusResourceProps = {
  moderationStatus: IPublicationResource;
  onChange: (value: IPublicationResource) => void;
};

const SelectModerationStatusResource = ({
  moderationStatus,
  onChange,
}: SelectModerationStatusResourceProps) => {
  return (
    <Select
      onValueChange={(value) => onChange(value as IPublicationResource)}
      value={moderationStatus}
    >
      <SelectTrigger>
        <SelectValue></SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {MODERATION_STATUS_RESOURCE.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default SelectModerationStatusResource;
