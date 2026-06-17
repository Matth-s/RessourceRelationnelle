import { useQuery } from "@tanstack/react-query";
import { getCommentsByResourceId } from "../api/get-comment-by-resource-id-api";
import { FETCH_KEYS } from "@/types/fetch-key-type";
import CommentResourceIdCard from "./CommentResourceIdCard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import CreateComment from "./CreateComment";

type CommentResourceIdListProps = {
  id: string;
};

const CommentResourceIdList = ({ id }: CommentResourceIdListProps) => {
  const {
    data: comments = [],
    isPending,
    error,
  } = useQuery({
    queryFn: () => getCommentsByResourceId(id),
    queryKey: [FETCH_KEYS.COMMENTS, id],
  });

  if (isPending) return <p>Chargement des commentaires</p>;

  if (error)
    return (
      <p>Une erreur est survenue lors de la récupération des commentaires</p>
    );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Commentaire{comments.length > 1 ? "s" : ""} :</CardTitle>
        <CardDescription aria-describedby="undefined" />
      </CardHeader>
      <CardContent className="flex flex-col gap-y-3">
        <CreateComment resourceId={id} />
        {comments.map((comment) => (
          <CommentResourceIdCard key={comment.id} comment={comment} />
        ))}
      </CardContent>
    </Card>
  );
};

export default CommentResourceIdList;
