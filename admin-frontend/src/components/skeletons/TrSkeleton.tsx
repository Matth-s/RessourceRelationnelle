import { Skeleton } from "../ui/skeleton";
import { TableCell, TableRow } from "../ui/table";

type TrSkeletonProps = {
  length?: number;
  columns?: number;
};

const TrSkeleton = ({ length = 5, columns = 4 }: TrSkeletonProps) => {
  return (
    <>
      {Array.from({ length }).map((_, rowIdx) => (
        <TableRow key={rowIdx}>
          {Array.from({ length: columns }).map((_, colIdx) => (
            <TableCell key={colIdx} className="p-4">
              <Skeleton className="h-4 w-full" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
};

export default TrSkeleton;
