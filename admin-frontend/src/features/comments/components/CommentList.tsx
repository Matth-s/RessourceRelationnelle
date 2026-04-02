import CardFetchError from "@/components/CardFetchError";
import CommentCard from "./CommentCard";

import { COMMENT_TABLE_HEADER } from "../constants/comments-constants";
import type { commentArrayType } from "../schemas/comments-schema";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { ICommentModeration } from "@/types/comment-type";

type CommentListProps = {
  error: Error | null;
  isLoading: boolean;
  comments: commentArrayType;
  selectedDate?: string;
  selectedStatus?: ICommentModeration;
  refrech: () => void;
};

const CommentList = ({
  error,
  isLoading,
  comments,
  selectedDate,
  selectedStatus,
  refrech,
}: CommentListProps) => {
  if (isLoading) return <div>chargement</div>;

  if (error) return <CardFetchError onRetry={refrech} />;

  return (
    <div className="bg-muted/40 w-full overflow-hidden rounded-xl border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/60">
            {COMMENT_TABLE_HEADER.map((header) => (
              <TableHead
                key={header.name}
                className="text-muted-foreground text-center text-sm font-semibold"
              >
                {header.name}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {comments.length === 0 ? (
            <TableRow>
              <td
                colSpan={COMMENT_TABLE_HEADER.length}
                className="py-6 text-center"
              >
                {selectedDate || selectedStatus ? (
                  <div>
                    <p className="text-sm font-medium">
                      Aucun résultat avec les filtres sélectionnés
                    </p>
                    <p className="text-muted-foreground text-xs">
                      Essayez de modifier ou réinitialiser les filtres
                    </p>
                  </div>
                ) : (
                  <p className="text-sm font-medium">
                    Aucun commentaire disponible
                  </p>
                )}
              </td>
            </TableRow>
          ) : (
            comments.map((comment) => (
              <CommentCard key={comment.id} comment={comment} />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default CommentList;
