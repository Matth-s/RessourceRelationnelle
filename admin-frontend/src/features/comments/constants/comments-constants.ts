import {
  COMMENT_MODERATION_ENUM,
  type IModerationSelect,
} from "@/types/comment-type";

export const COMMENT_TABLE_HEADER = [
  {
    name: "Date",
  },
  {
    name: "Message",
  },
  {
    name: "Status",
  },
];

export const MODERATION_SELECT_CHOICE: IModerationSelect[] = [
  {
    name: "Validé",
    value: COMMENT_MODERATION_ENUM.Approved,
  },
  {
    name: "En attente",
    value: COMMENT_MODERATION_ENUM.Pending,
  },
];
