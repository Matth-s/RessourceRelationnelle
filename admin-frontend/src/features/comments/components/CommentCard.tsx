import { TableCell, TableRow } from "@/components/ui/table";
import type { commentObjectType } from "../schemas/comments-schema";
import { formatCommentModerationStatus } from "../helpers/comments-helper";
import ShowComment from "./ShowComment";

type CommentCardProps = {
  comment: commentObjectType;
};

const CommentCard = ({ comment }: CommentCardProps) => {
  const { content, createdAt, moderationStatus } = comment;

  return (
    <TableRow>
      <TableCell className="text-center">
        {createdAt.toLocaleDateString()}
      </TableCell>
      <TableCell className="max-w-80 overflow-hidden text-left text-ellipsis">
        {content}
      </TableCell>
      <TableCell className="text-center">
        {formatCommentModerationStatus(moderationStatus)}
      </TableCell>
      <TableCell>
        <ShowComment comment={comment} />
      </TableCell>
    </TableRow>
  );
};

export default CommentCard;
