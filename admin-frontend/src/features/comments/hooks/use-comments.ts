import { useQuery } from "@tanstack/react-query";
import { getCommentsApi } from "../api/get-comments-api";
import { getUniquesDateComment } from "../helpers/comments-helper";
import { useMemo, useState } from "react";
import type { ICommentModeration } from "@/types/comment-type";
import { FETCH_KEYS } from "@/types/fetch-key-type";

export const useComments = () => {
  const [selectedDate, setSelectedDate] = useState<string | undefined>(
    undefined,
  );
  const [selectedStatus, setSelectedStatus] = useState<
    ICommentModeration | undefined
  >(undefined);

  const {
    isLoading,
    error,
    data = [],
    refetch,
  } = useQuery({
    queryKey: [FETCH_KEYS.COMMENTS],
    queryFn: getCommentsApi,
    retry: false
  });

  const uniquesDate = getUniquesDateComment(data);

  const handleSelectDate = (date: string) => {
    setSelectedDate(date);
  };

  const handleSelectStatus = (status: ICommentModeration) => {
    setSelectedStatus(status);
  };

  const commentsFiltred = useMemo(() => {
    return data.filter((comment) => {
      const matchDate = selectedDate
        ? comment.createdAt.toLocaleDateString() === selectedDate
        : true;

      const matchStatus = selectedStatus
        ? comment.moderationStatus === selectedStatus
        : true;

      return matchDate && matchStatus;
    });
  }, [selectedDate, selectedStatus, data]);

  const resetFilter = () => {
    setSelectedDate(undefined);
    setSelectedStatus(undefined);
  };

  return {
    isLoading,
    error,
    data,
    selectedDate,
    uniquesDate,
    commentsFiltred,
    selectedStatus,
    resetFilter,
    handleSelectStatus,
    handleSelectDate,
    refetch,
  };
};
