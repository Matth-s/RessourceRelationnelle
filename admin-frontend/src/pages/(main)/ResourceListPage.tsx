import { Button } from "@/components/ui/button";
import ResourceFilter from "@/features/resources/components/ResourceFilter";
import ResourceList from "@/features/resources/components/ResourceList";
import { useResource } from "@/features/resources/hooks/use-resource";
import { Link } from "react-router";

const ResourceListPage = () => {
  const {
    isLoading,
    error,
    resources,
    uniquePublicationStatuses,
    selectedModerationStatus,
    refetch,
    setSelectedModerationStatus,
  } = useResource();

  return (
    <div>
      <div className="flex items-center justify-between">
        <ResourceFilter
          onChangeFilter={setSelectedModerationStatus}
          filters={uniquePublicationStatuses}
          selectedModerationStatus={selectedModerationStatus}
          resourceLength={resources.length}
        />

        <Link to={"/ressources/"}>
          <Button variant="outline">Ajouter une ressource</Button>
        </Link>
      </div>

      <ResourceList
        error={error}
        isLoading={isLoading}
        resources={resources}
        refetch={refetch}
      />
    </div>
  );
};

export default ResourceListPage;
