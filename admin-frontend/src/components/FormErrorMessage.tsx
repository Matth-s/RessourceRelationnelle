import { cn } from '@/lib/utils';

type FormErrorMessageProps = {
  message?: string;
  className?: string;
};

const FormErrorMessage = ({
  message,
  className,
}: FormErrorMessageProps) => {
  if (!message) return null;

  return (
    <div
      className={cn(
        'rounded-lg border border-pink-300 bg-pink-100 px-4 py-2 text-center text-sm font-semibold text-pink-700 shadow-md',
        className,
      )}
    >
      {message}
    </div>
  );
};

export default FormErrorMessage;
