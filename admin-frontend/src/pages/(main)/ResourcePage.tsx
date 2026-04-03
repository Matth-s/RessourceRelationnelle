import { AuthenticatedLayout } from "@/components/AuthenticatedLayout";
import CreateRessource from "@/features/resources/components/CreateRessource";

const ResourcePage = () => {
  return (
    <AuthenticatedLayout>
      <p>ressources page</p>
      <CreateRessource />
    </AuthenticatedLayout>
  );
};

export default ResourcePage;
