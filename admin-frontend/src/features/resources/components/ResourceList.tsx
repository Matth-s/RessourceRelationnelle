import CardFetchError from "@/components/CardFetchError";
import type { resourceArrayType } from "../schemas/ressource-schema";
import ResourceCard from "./ResourceCard";

type ResourceListProps = {
  isLoading: boolean;
  error: Error | null;
  resources: resourceArrayType;
  searchText: string;
  refetch: () => void;
};

const ResourceList = ({
  isLoading,
  error,
  resources,
  searchText,
  refetch,
}: ResourceListProps) => {
  if (isLoading) return <p>is loading</p>;

  if (error) return <CardFetchError onRetry={refetch} />;

  return (
    <div className="mx-auto max-w-4xl columns-2 gap-4">
      {resources.length === 0 && searchText !== "" ? (
        <p>
          Aucun résultat pour la recherche :{" "}
          <span className="font-bold">{searchText}</span>
        </p>
      ) : (
        resources.map((resource) => (
          <div key={resource.id} className="mb-4 break-inside-avoid">
            <ResourceCard resource={resource} />
          </div>
        ))
      )}
    </div>
  );
};

export default ResourceList;
