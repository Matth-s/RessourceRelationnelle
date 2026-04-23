import CardFetchError from "@/components/CardFetchError";
import type { resourceArrayType } from "../schemas/ressource-schema";
import ResourceCard from "./ResourceCard";

type ResourceListProps = {
  isLoading: boolean;
  error: Error | null;
  resources: resourceArrayType;
  refetch: () => void;
};

const ResourceList = ({
  isLoading,
  error,
  resources,
  refetch,
}: ResourceListProps) => {
  if (isLoading) return <p>is loading</p>;

  if (error) return <CardFetchError onRetry={refetch} />;

  return (
    <div className="flex flex-wrap justify-center gap-4">
      {resources.map((resource) => (
        <ResourceCard key={resource.id} resource={resource} />
      ))}
    </div>
  );
};

export default ResourceList;
