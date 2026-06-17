import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  COMMENT_MODERATION_ENUM,
  type ICommentModeration,
} from "@/types/comment-type";

type CommentFilterProps = {
  uniqueDates: string[];
  selectedDate?: string;
  selectedStatus?: ICommentModeration;
  resetFilter: () => void;
  handleSelectDate: (date: string) => void;
  handleSelectStatus: (status: ICommentModeration) => void;
};

const CommentFilter = ({
  uniqueDates,
  selectedStatus,
  selectedDate,
  resetFilter,
  handleSelectDate,
  handleSelectStatus,
}: CommentFilterProps) => {
  return (
    <div className="flex items-center gap-x-3">
      <div className="flex items-center gap-x-2">
        <p>Filtrer par date :</p>
        <Select
          onValueChange={(e) => handleSelectDate(e)}
          defaultValue={selectedDate}
        >
          <SelectTrigger>
            <SelectValue placeholder="Trier par date" />
          </SelectTrigger>

          <SelectContent>
            <SelectGroup>
              {uniqueDates.map((date) => (
                <SelectItem key={date} value={date}>
                  {date}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-x-2">
        <p>Filtrer par status :</p>
        <Select
          onValueChange={(e) => handleSelectStatus(e as ICommentModeration)}
          defaultValue={selectedStatus}
        >
          <SelectTrigger>
            <SelectValue placeholder="Trier par status" />
          </SelectTrigger>

          <SelectContent>
            <SelectGroup>
              <SelectItem value={COMMENT_MODERATION_ENUM.Approved}>
                Validé
              </SelectItem>
              <SelectItem value={COMMENT_MODERATION_ENUM.Pending}>
                En attente
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {(selectedDate || selectedStatus) && (
        <Button className="ml-auto" onClick={() => resetFilter()}>
          Supprimer les filtres
        </Button>
      )}
    </div>
  );
};

export default CommentFilter;
