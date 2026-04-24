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

type CreateResourceFormProps = {
  username: string;
  formData: UseFormReturn<createOrUpdateSchemaType>;
};

const CreateResourceForm = ({
  formData,
  username,
}: CreateResourceFormProps) => {
  const [file, setFile] = useState<File | undefined>(undefined);

  useEffect(() => {
    setFile(formData.getValues("file"));
  }, [formData.watch("file")]);

  return (
    <div className="flex flex-col gap-y-4">
      <div className="mx-auto h-96 w-full overflow-hidden rounded-lg">
        {file !== undefined ? (
          <img
            src={URL.createObjectURL(file)}
            className="h-full max-h-96 w-full max-w-4xl rounded-lg object-contain"
            alt="preview"
          />
        ) : (
          <input
            type="file"
            onChange={(e) => {
              const file = e.target.files?.[0];

              if (file) {
                formData.setValue("file", file);
              }
            }}
          />
        )}
      </div>

      <p className="w-fit rounded-sm bg-blue-100 px-3 py-1 text-sm">
        Type de relation
      </p>

      <Controller
        name="title"
        control={formData.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <Input className="text-2xl font-bold" {...field} />

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
        <p>Type de resource</p>
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
