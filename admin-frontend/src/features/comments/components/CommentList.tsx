import CardFetchError from "@/components/CardFetchError";

type CommentListProps = {
  error: Error | null;
  isLoading: boolean;
  comments: [];
  refrech: () => void;
};

const CommentList = ({ error, isLoading, refrech }: CommentListProps) => {
  if (isLoading) return <div>chargement</div>;

  if (error) return <CardFetchError onRetry={refrech} />;

  return <div>liste des commentaires</div>;
};

export default CommentList;
