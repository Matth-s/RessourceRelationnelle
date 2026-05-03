import CreateResourceForm from "./CreateResourceForm";
import ResourceIdContent from "./ResourceIdContent";
import SheetFormModeration from "./SheetFormModeration";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createResourceApi } from "../api/create-resource-api";
import { useForm } from "react-hook-form";
import {
  createOrUpdateSchema,
  type createOrUpdateSchemaType,
} from "../schemas/create-or-update-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { PUBLICATION_RESOURCE_KEY } from "@/types/resource-type";
import { useState } from "react";
import { transformCreateResourceToView } from "../helpers/resource-helper";
import { Button } from "@/components/ui/button";

import { toast } from "sonner";
import { FETCH_KEYS } from "@/types/fetch-key-type";
import { useNavigate } from "react-router";

import type { ICurrentUserResponse } from "@/features/user/schemas/current-user-schema";

type CreateRessourceProps = {
  user: ICurrentUserResponse;
};

const CreateRessource = ({ user }: CreateRessourceProps) => {
  const [isEditingView, setIsEditingView] = useState<boolean>(true);
  const [resourceName, setResourceName] = useState<string | undefined>(
    undefined,
  );
  const [relationName, setRelationName] = useState<string | undefined>(
    undefined,
  );

  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const form = useForm<createOrUpdateSchemaType>({
    defaultValues: {
      title: "Titre de la ressource",
      resume: "Résumé de la ressource",
      content: "Contenue de la ressource",
      file: undefined,
      categoryId: "1044397e-384d-4cda-bbd9-39b7be7a2aba",
      resourceTypeId: "bb60d7f9-56d0-4d6a-8b65-ccee14a2be6a",
      relationTypeId: "66732a34-3cd4-4dd6-896b-d287f60ed4f4",
      isVisible: true,
      publicationStatus: PUBLICATION_RESOURCE_KEY.APPROUVED,
      mediaType: "image",
    },
    resolver: zodResolver(createOrUpdateSchema),
  });

  const { handleSubmit, setError } = form;

  const createResourceMutation = useMutation({
    mutationFn: createResourceApi,

    onSuccess(data) {
      toast.success(`La ressource a été crée avec succès`);
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
    createResourceMutation.mutate(formData);
  };

  return (
    <form
      id="create-resource-form"
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

        <SheetFormModeration formData={form} />
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

export default CreateRessource;
