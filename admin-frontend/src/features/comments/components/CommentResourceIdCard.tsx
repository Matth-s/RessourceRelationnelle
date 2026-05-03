import type { commentResourceIdObjectType } from "../schemas/comments-schema";

type CommentResourceIdCardProps = {
  comment: commentResourceIdObjectType;
};

const CommentResourceIdCard = ({ comment }: CommentResourceIdCardProps) => {
  return (
    <div className="flex gap-4 rounded-xl border bg-white p-4 shadow-sm">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-sm font-semibold text-gray-600">
        {comment.user.username.charAt(0).toUpperCase()}
      </div>

      <div className="flex flex-1 flex-col gap-1">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-gray-900">
            {comment.user.username}
          </p>

          <p className="text-xs">
            Posté le : {new Date(comment.createdAt).toLocaleDateString("fr-FR")}
          </p>
        </div>

        <p className="text-sm text-gray-700">{comment.content}</p>
      </div>
    </div>
  );
};

export default CommentResourceIdCard;
