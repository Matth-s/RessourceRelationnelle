/* eslint-disable react-hooks/set-state-in-effect */
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar, Eye, Heart, User } from "lucide-react";
import { Controller, type UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Field, FieldError } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";

import type { createOrUpdateSchemaType } from "../schemas/create-or-update-schema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useRelationType } from "@/hooks/use-relation-type";
import { useResourceType } from "@/hooks/use-resource-type";
import { ACCEPTED_TYPES } from "../constant/resource-constant";

import CreateResourcePreview from "./CreateResourcePreview";

type CreateResourceFormProps = {
  username: string;
  formData: UseFormReturn<createOrUpdateSchemaType>;
  setResourceName: (value?: string) => void;
  setRelationName: (value?: string) => void;
};

const CreateResourceForm = ({
  formData,
  username,
  setRelationName,
  setResourceName,
}: CreateResourceFormProps) => {
  const [file, setFile] = useState<File | undefined>(undefined);
  const resourceTypeId = formData.watch("resourceTypeId");
  const relationId = formData.watch("relationTypeId");

  const { data: relations = [] } = useRelationType();
  const { data: resourceType = [] } = useResourceType();

  useEffect(() => {
    setFile(formData.getValues("file"));
  }, [formData.watch("file")]);

  useEffect(() => {
    const findItem = resourceType.find((item) => item.id === resourceTypeId);

    setResourceName(findItem?.typeRessource);
  }, [resourceTypeId]);

  useEffect(() => {
    const findItem = relations.find((item) => item.id === relationId);

    setRelationName(findItem?.typeRelation);
  }, [relationId]);

  return (
    <div className="flex flex-col gap-y-4">
      <div className="mx-auto h-96 w-full overflow-hidden rounded-lg">
        {file !== undefined ? (
          <CreateResourcePreview file={file} />
        ) : (
          <input
            type="file"
            accept={ACCEPTED_TYPES}
            onChange={(e) => {
              const file = e.target.files?.[0];

              if (file) {
                formData.setValue("file", file);
              }
            }}
          />
        )}
      </div>

      <Controller
        name="relationTypeId"
        control={formData.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger>
                <SelectValue placeholder="Type de relation" />
              </SelectTrigger>

              <SelectContent>
                {relations.map((relation) => (
                  <SelectItem key={relation.id} value={relation.id}>
                    {relation.typeRelation}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name="title"
        control={formData.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <Input
              className="text-2xl font-bold"
              {...field}
              aria-label="title"
            />

            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name="resume"
        control={formData.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <Textarea {...field} />

            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <User />
          <p>{username}</p>
        </div>

        <div className="flex items-center gap-2">
          <Calendar />
          <p>{new Date().toLocaleDateString()}</p>
        </div>

        <div className="flex items-center gap-2">
          <Eye />
          <p>0 vues</p>
        </div>
        <div className="flex items-center gap-2">
          <Heart />
          <p>0 j'aime</p>
        </div>
      </div>

      <div className="rounded-xl bg-blue-100 px-4 py-8">
        <h3 className="font-bold">Types de relations concernées</h3>
        <Controller
          name="resourceTypeId"
          control={formData.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Type de relation" />
                </SelectTrigger>

                <SelectContent>
                  {resourceType.map((res) => (
                    <SelectItem key={res.id} value={res.id}>
                      {res.typeRessource}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-bold">Contenu</CardTitle>
          <CardDescription>
            <Controller
              name="content"
              control={formData.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <Textarea {...field} />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
};

export default CreateResourceForm;
