import CardFetchError from "@/components/CardFetchError";
import NotFoundResource from "@/features/resources/components/NotFoundResource";
import ResourceIdContent from "@/features/resources/components/ResourceIdContent";
import ModerateResourceModal from "@/features/resources/components/ModerateResourceModal";

import { Button } from "@/components/ui/button";
import { getResourceById } from "@/features/resources/api/get-resource-by-id-api";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router";
import { useAppSelector } from "@/store/hook";
import { FETCH_KEYS } from "@/types/fetch-key-type";
import DeleteResourceDialog from "@/features/resources/components/DeleteResource";
import CommentResourceIdList from "@/features/comments/components/CommentResourceIdList";

const ResourceIdPage = () => {
  const userId = useAppSelector((state) => state.auth.user?.id);
  const navigate = useNavigate();

  const { id } = useParams();

  const { isPending, error, refetch, data } = useQuery({
    queryKey: [FETCH_KEYS.RESOURCES, id],
    queryFn: () => getResourceById(id as string),
    retry: false,
  });

  if (!id) {
    navigate("/resources");
    return;
  }

  if (!userId) return;

  if (isPending) {
    return <p>Loading...</p>;
  }

  if (error) {
    if (error.message.includes("404")) {
      return <NotFoundResource />;
    }
    return <CardFetchError onRetry={refetch} />;
  }

  if (!data) return null;

  return (
    <div className="flex mx-auto max-w-4xl flex-col gap-y-4">
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          className="flex items-center gap-x-3"
          onClick={() => navigate(-1)}
        >
          <ChevronLeft />
          Retour
        </Button>

        <div className="flex items-center gap-x-4">
          <ModerateResourceModal resource={data} />
          <Link to={`/ressources/${data.id}/modifier`}>
            <Button variant="outline">Modifier le contenu</Button>
          </Link>

          <DeleteResourceDialog resource={data} />
        </div>
      </div>

      <ResourceIdContent resource={data} />

      <CommentResourceIdList id={id} />
    </div>
  );
};

export default ResourceIdPage;
