import { useAppSelector } from "@/store/hook";
import type { resourceObjectType } from "../schemas/ressource-schema";
import { formatPublicationStatus } from "../helpers/resource-helper";

type ResourceCardProps = {
  resource: resourceObjectType;
};

const ResourceCard = ({ resource }: ResourceCardProps) => {
  const user = useAppSelector((state) => state.auth.user);

  console.log(user);

  return (
    <div className="max-w-md rounded-lg bg-white p-4 shadow-md">
      <h3 className="text-center text-lg font-bold">{resource.title}</h3>
      <p>{resource.content}</p>

      <div className="mt-4 flex items-center">
        <p>Status : {formatPublicationStatus(resource.publicationStatus)}</p>
      </div>
    </div>
  );
};

export default ResourceCard;
