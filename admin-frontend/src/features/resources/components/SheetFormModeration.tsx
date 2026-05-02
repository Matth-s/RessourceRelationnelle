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
};

const SheetFormModeration = ({ formData }: SheetFormModerationProps) => {
  return (
    <Sheet>
      <SheetTrigger className="ml-auto" asChild>
        <Button variant="outline">Ouvrir les menus</Button>
      </SheetTrigger>
      <SheetContent className="px-4 pb-8">
        <SheetHeader className="p-8">
          <SheetTitle>
            Modifier la visibilité et le statut de publication
          </SheetTitle>
          <SheetDescription aria-describedby={undefined} />
        </SheetHeader>

        <div className="flex flex-col gap-y-4 pl-5">
          <div className="flex w-full flex-col gap-y-2">
            <Label>Visibilité de la ressource</Label>
            <VisibilityResourceSelectForm
              onChange={(value: boolean) =>
                formData.setValue("isVisible", value)
              }
              value={formData.watch("isVisible")}
            />
          </div>

          <div className="flex flex-col gap-y-2">
            <Label>Statut de publication</Label>
            <SelectModerationStatusResource
              onChange={(value: IPublicationResource) =>
                formData.setValue("publicationStatus", value)
              }
              moderationStatus={formData.watch("publicationStatus")}
            />
          </div>
        </div>

        <Button type="submit" form="create-resource-form">
          Créer la ressource
        </Button>
      </SheetContent>
    </Sheet>
  );
};

export default SheetFormModeration;
