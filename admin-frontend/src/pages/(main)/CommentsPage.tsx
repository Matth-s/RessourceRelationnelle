import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";
import { useComments } from "@/features/comments/hooks/use-comments";

import CommentFilter from "@/features/comments/components/CommentFilter";
import CommentList from "@/features/comments/components/CommentList";

const CommentsPage = () => {
  const {
    isLoading,
    error,
    uniquesDate,
    selectedDate,
    commentsFiltred,
    selectedStatus,
    resetFilter,
    refetch,
    handleSelectDate,
    handleSelectStatus,
  } = useComments();

  return (
    <AuthenticatedLayout>
      <div className="flex h-full min-h-full flex-col gap-y-4">
        <CommentFilter
          uniqueDates={uniquesDate}
          selectedDate={selectedDate}
          selectedStatus={selectedStatus}
          handleSelectDate={handleSelectDate}
          handleSelectStatus={handleSelectStatus}
          resetFilter={resetFilter}
        />

        <CommentList
          isLoading={isLoading}
          error={error}
          refrech={refetch}
          comments={commentsFiltred}
          selectedDate={selectedDate}
          selectedStatus={selectedStatus}
        />
      </div>
    </AuthenticatedLayout>
  );
};

export default CommentsPage;
