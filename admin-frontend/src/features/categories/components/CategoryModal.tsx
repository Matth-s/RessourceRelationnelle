import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type CategoryModalProps = {
  dialogButton: React.ReactElement | null;
  dialogTitle: string;
  dialogDescription: string;
  form: React.ReactElement;
  setIsOpen: () => void;
  isOpen: boolean;
};

const CategoryModal = ({
  dialogButton,
  dialogDescription,
  dialogTitle,
  form,
  setIsOpen,
  isOpen,
}: CategoryModalProps) => {
  return (
    <Dialog onOpenChange={() => setIsOpen()} open={isOpen}>
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
