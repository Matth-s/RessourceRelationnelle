import type { ICommentModeration } from "@/types/comment-type";
import type { commentArrayType } from "../schemas/comments-schema";

export const formatCommentModerationStatus = (
  status: ICommentModeration,
): string => {
  let statusFormatted = "Inconnu";
  switch (status) {
    case "Approved":
      statusFormatted = "Validé";
      break;
    case "Pending":
      statusFormatted = "En attente";
      break;

    default:
      statusFormatted = "Inconnu";
  }

  return statusFormatted;
};

export const getUniquesDateComment = (data: commentArrayType): string[] => {
  const dates = data.map((item) => item.createdAt.toLocaleDateString());

  return [...new Set(dates)];
};
