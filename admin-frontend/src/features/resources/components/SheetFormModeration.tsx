import VisibilityResourceSelectForm from "./VisibilityResourceSelectForm";
import SelectModerationStatusResource from "./SelectModerationStatusResource";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import type { IPublicationResource } from "@/types/resource-type";
import type { createOrUpdateSchemaType } from "../schemas/create-or-update-schema";
import type { UseFormReturn } from "react-hook-form";

type SheetFormModerationProps = {
  formData: UseFormReturn<createOrUpdateSchemaType>;
  formId?: string;
};

const SheetFormModeration = ({ formData, formId = "create-resource-form" }: SheetFormModerationProps) => {
  return (
    <Sheet>
      <SheetTrigger className="ml-auto" asChild>
        <Button variant="outline">Soumettre</Button>
      </SheetTrigger>
      <SheetContent className="px-4 pb-8">
        <SheetHeader>
          <SheetTitle>Finalisation de la nouvelle ressource</SheetTitle>
          <SheetDescription aria-describedby={undefined} />
        </SheetHeader>

        <div className="flex flex-col gap-y-4">
          <div className="flex w-full flex-col gap-y-2">
            <Label>Visibilité de la ressource</Label>
            <VisibilityResourceSelectForm
              onChange={(value: boolean) =>
                formData.setValue("isVisible", value)
              }
              value={formData.watch("isVisible")}
              className="w-full"
            />
          </div>

          <div className="flex flex-col gap-y-2">
            <Label>Statut de publication</Label>
            <SelectModerationStatusResource
              onChange={(value: IPublicationResource) =>
                formData.setValue("publicationStatus", value)
              }
              moderationStatus={formData.watch("publicationStatus")}
              className="w-full"
            />
          </div>
        </div>

        <Button type="submit" form={formId}>
          Enregistrer
        </Button>
      </SheetContent>
    </Sheet>
  );
};

export default SheetFormModeration;
