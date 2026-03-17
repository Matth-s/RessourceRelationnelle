import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type CategoryModalProps = {
  dialogButton: React.ReactElement;
  dialogTitle: string;
  dialogDescription: string;
  form: React.ReactElement;
};

const CategoryModal = ({
  dialogButton,
  dialogDescription,
  dialogTitle,
  form,
}: CategoryModalProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{dialogButton}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>{dialogDescription}</DialogDescription>
        </DialogHeader>

        {form}
      </DialogContent>
    </Dialog>
  );
};

export default CategoryModal;
