import CardFetchError from "@/components/CardFetchError";
import NotFoundResource from "@/features/resources/components/NotFoundResource";
import EditRessource from "@/features/resources/components/EditRessource";

import { getResourceById } from "@/features/resources/api/get-resource-by-id-api";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";
import { useAppSelector } from "@/store/hook";
import { FETCH_KEYS } from "@/types/fetch-key-type";

const ResourceEditPage = () => {
  const { user } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const { id } = useParams();

  const { isPending, error, refetch, data } = useQuery({
    queryKey: [FETCH_KEYS.RESOURCES, id],
    queryFn: () => getResourceById(id as string),
    retry: false,
  });

  if (!user) {
    navigate("/authentification/connexion");
    return;
  }

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
    <div className="mx-auto flex max-w-4xl flex-col gap-y-8">
      <h1 className="text-center text-2xl font-bold">
        Modifier la ressource
      </h1>

      <EditRessource user={user} resource={data} />
    </div>
  );
};

export default ResourceEditPage;
