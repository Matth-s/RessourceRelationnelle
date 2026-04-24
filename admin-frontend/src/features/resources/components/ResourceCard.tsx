import { formatPublicationStatus } from "../helpers/resource-helper";
import { NavLink } from "react-router";

import type { resourceObjectType } from "../schemas/ressource-schema";

type ResourceCardProps = {
  resource: resourceObjectType;
};

const ResourceCard = ({ resource }: ResourceCardProps) => {
  const { title, resume, publicationStatus } = resource;

  return (
    <NavLink
      to={`/ressources/${resource.id}`}
      className="block h-fit max-w-md rounded-lg bg-white p-4 shadow-md"
    >
      <h3 className="text-center text-lg font-bold">{title}</h3>
      <p>{resume}</p>

      <div className="mt-4 flex items-center">
        <p>Status : {formatPublicationStatus(publicationStatus)}</p>
      </div>
    </NavLink>
  );
};

export default ResourceCard;
