import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";
import { useResource } from "@/features/resources/hooks/use-resource";

import ResourceList from "@/features/resources/components/ResourceList";
import ResourceFilter from "@/features/resources/components/ResourceFilter";

const ResourcePage = () => {
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
    <AuthenticatedLayout>
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
    </AuthenticatedLayout>
  );
};

export default ResourcePage;
