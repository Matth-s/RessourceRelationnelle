import { Button } from "@/components/ui/button";
import { useResource } from "@/features/resources/hooks/use-resource";
import { Link } from "react-router";

import ResourceFilter from "@/features/resources/components/ResourceFilter";
import ResourceList from "@/features/resources/components/ResourceList";
import ResourceSearchBar from "@/features/resources/components/ResourceSearchBar";

const ResourceListPage = () => {
  const {
    isLoading,
    error,
    data,
    resources,
    uniquePublicationStatuses,
    selectedModerationStatus,
    searchText,
    setSearchText,
    refetch,
    setSelectedModerationStatus,
  } = useResource();

  return (
    <div>
      <div className="mb-4 flex items-center gap-3">
        <ResourceSearchBar
          defaultValue={searchText}
          setSearchText={(e: string) => setSearchText(e)}
        />

        <ResourceFilter
          onChangeFilter={setSelectedModerationStatus}
          filters={uniquePublicationStatuses}
          selectedModerationStatus={selectedModerationStatus}
          resources={data}
        />

        <Link to={"/ressources/nouvelle-ressource"}>
          <Button variant="outline">Ajouter une ressource</Button>
        </Link>
      </div>

      <ResourceList
        searchText={searchText}
        error={error}
        isLoading={isLoading}
        resources={resources}
        refetch={refetch}
      />
    </div>
  );
};

export default ResourceListPage;
