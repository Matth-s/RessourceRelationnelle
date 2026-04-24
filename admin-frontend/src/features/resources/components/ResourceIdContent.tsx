import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { resourceObjectType } from "../schemas/ressource-schema";
import { Calendar, Eye, Heart, User } from "lucide-react";

type ResourceIdContentProps = {
  resource: resourceObjectType;
};

const ResourceIdContent = ({ resource }: ResourceIdContentProps) => {
  const {
    mediaType,
    mediaUrl,
    typeRelation,
    typeResource,
    title,
    resume,
    user,
    createdAt,
    content,
    viewCount,
    likeCount,
  } = resource;

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-4">
      {mediaType && (
        <div className="h-96 w-full overflow-hidden rounded-xl">
          {mediaType === "image" && mediaUrl && (
            <img className="h-full w-full object-contain" src={mediaUrl} />
          )}

          {mediaType === "video" && mediaUrl && (
            <video controls>
              <source src={mediaUrl} type="video/mp4" />
            </video>
          )}
        </div>
      )}

      <p className="w-fit rounded-sm bg-blue-100 px-3 py-1 text-sm">
        {typeRelation.typeRelation.toLowerCase()}
      </p>

      <h2 className="text-2xl font-bold">{title}</h2>

      <p>{resume}</p>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <User />
          <p>{user.username}</p>
        </div>

        <div className="flex items-center gap-2">
          <Calendar />
          <p>{new Date(createdAt).toLocaleDateString()}</p>
        </div>

        <div className="flex items-center gap-2">
          <Eye />
          <p> {viewCount} vues</p>
        </div>
        <div className="flex items-center gap-2">
          <Heart />
          <p>{likeCount} j'aime</p>
        </div>
      </div>

      <div className="rounded-xl bg-blue-100 px-4 py-8">
        <h3 className="font-bold">Types de relations concernées</h3>
        <p>{typeResource.typeRessource.toLowerCase()}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-bold">Contenu</CardTitle>
          <CardDescription>{content}</CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
};

export default ResourceIdContent;
