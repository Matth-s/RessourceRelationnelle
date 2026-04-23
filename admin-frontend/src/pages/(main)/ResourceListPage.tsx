import ResourceFilter from "@/features/resources/components/ResourceFilter";
import ResourceList from "@/features/resources/components/ResourceList";
import { useResource } from "@/features/resources/hooks/use-resource";

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
      <ResourceFilter
        onChangeFilter={setSelectedModerationStatus}
        filters={uniquePublicationStatuses}
        selectedModerationStatus={selectedModerationStatus}
        resourceLength={resources.length}
      />

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
