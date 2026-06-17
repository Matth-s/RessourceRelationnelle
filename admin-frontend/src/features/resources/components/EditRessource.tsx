import CreateResourceForm from "./CreateResourceForm";
import ResourceIdContent from "./ResourceIdContent";
import SheetFormModeration from "./SheetFormModeration";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateResourceContentApi } from "../api/update-resource-content-api";
import { useForm } from "react-hook-form";
import {
  createOrUpdateSchema,
  type createOrUpdateSchemaType,
} from "../schemas/create-or-update-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { transformCreateResourceToView } from "../helpers/resource-helper";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { FETCH_KEYS } from "@/types/fetch-key-type";
import { useNavigate } from "react-router";

import type { ICurrentUserResponse } from "@/features/user/schemas/current-user-schema";
import type { resourceObjectType } from "../schemas/ressource-schema";

type EditRessourceProps = {
  user: ICurrentUserResponse;
  resource: resourceObjectType;
};

const EditRessource = ({ user, resource }: EditRessourceProps) => {
  const [isEditingView, setIsEditingView] = useState<boolean>(true);
  const [resourceName, setResourceName] = useState<string | undefined>(
    resource.typeResource.typeRessource,
  );
  const [relationName, setRelationName] = useState<string | undefined>(
    resource.typeRelation.typeRelation,
  );

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const form = useForm<createOrUpdateSchemaType>({
    defaultValues: {
      title: resource.title,
      resume: resource.resume,
      content: resource.content,
      file: undefined,
      categoryId: resource.category.id,
      resourceTypeId: resource.typeResource.id,
      relationTypeId: resource.typeRelation.id,
      isVisible: resource.isVisible,
      publicationStatus: resource.publicationStatus,
      mediaType: resource.mediaType ?? "image",
    },
    resolver: zodResolver(createOrUpdateSchema),
  });

  const { handleSubmit, setError } = form;

  const updateResourceMutation = useMutation({
    mutationFn: (data: createOrUpdateSchemaType) =>
      updateResourceContentApi(resource.id, data),

    onSuccess(data) {
      toast.success("La ressource a été modifiée avec succès");
      queryClient.invalidateQueries({ queryKey: [FETCH_KEYS.RESOURCES] });
      navigate(`/ressources/${data.id}`);
    },

    onError(err) {
      let message = "Une erreur est survenue";

      if (err instanceof Error) {
        message = err.message;
      }

      setError("root", {
        message,
      });
    },
  });

  const handleFormSubmit = (formData: createOrUpdateSchemaType) => {
    updateResourceMutation.mutate(formData);
  };

  return (
    <form
      id="edit-resource-form"
      onSubmit={handleSubmit(handleFormSubmit)}
      className="mx-auto flex w-full flex-col gap-y-4"
    >
      <div className="sticky top-2 flex w-full gap-4 bg-gray-100">
        <Button
          type="button"
          variant={isEditingView ? "default" : "outline"}
          onClick={() => setIsEditingView(true)}
        >
          Vue éditoriale
        </Button>
        <Button
          type="button"
          variant={isEditingView ? "outline" : "default"}
          onClick={() => setIsEditingView(false)}
        >
          Vue ressource
        </Button>

        <SheetFormModeration formData={form} formId="edit-resource-form" />
      </div>

      {isEditingView ? (
        <CreateResourceForm
          formData={form}
          username={user.username}
          setResourceName={(value?: string) => setResourceName(value)}
          setRelationName={(value?: string) => setRelationName(value)}
        />
      ) : (
        <ResourceIdContent
          resource={transformCreateResourceToView({
            formData: form.getValues(),
            user: {
              id: user.id,
              username: user.username,
            },
            relationName,
            resourceName,
          })}
        />
      )}
    </form>
  );
};

export default EditRessource;
