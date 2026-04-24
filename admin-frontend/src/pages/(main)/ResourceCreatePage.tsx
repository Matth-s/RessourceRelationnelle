import CreateRessource from "@/features/resources/components/CreateRessource";
import { useAppSelector } from "@/store/hook";
import { useNavigate } from "react-router";

const ResourceCreatePage = () => {
  const { user } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  if (!user) {
    navigate("/authentification/connexion");
    return;
  }
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-y-8">
      <h1 className="text-center text-2xl font-bold">
        Créer une nouvelle ressource
      </h1>

      <CreateRessource user={user} />
    </div>
  );
};

export default ResourceCreatePage;
