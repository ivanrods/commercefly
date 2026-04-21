import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function Loading() {
  const rows = Array.from({ length: 5 });

  return (
    <Table className="animate-pulse">
      <TableHeader>
        <TableRow>
          <TableHead>
            <Skeleton className="h-4 w-24 rounded-md" />
          </TableHead>
          <TableHead>
            <Skeleton className="h-4 w-24 rounded-md" />
          </TableHead>
          <TableHead>
            <Skeleton className="h-4 w-24 rounded-md" />
          </TableHead>
          <TableHead className="text-right">
            <Skeleton className="h-4 w-16 rounded-md" />
          </TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {rows.map((_, index) => (
          <TableRow key={index}>
            <TableCell>
              <Skeleton className="h-4 w-32 rounded-md" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-24 rounded-md" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-32 rounded-md" />
            </TableCell>
            <TableCell className="text-right">
              <Skeleton className="h-8 w-8 rounded-md inline-block" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
