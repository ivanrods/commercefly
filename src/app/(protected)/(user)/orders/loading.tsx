import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="p-6">
      <Card className="mx-auto my-6 max-w-(--breakpoint-xl)">
        <CardHeader className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
          <div className="space-y-2">
            <Skeleton className="h-6 w-64" />
            <Skeleton className="h-4 w-80" />
          </div>

          <Skeleton className="h-4 w-32" />
        </CardHeader>

        {Array.from({ length: 3 }).map((_, index) => (
          <CardContent key={index} className="space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-6 w-24 rounded-full" />
            </div>

            <div className="space-y-3">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-16 w-16 rounded-md" />

                  <Skeleton className="h-4 w-40" />

                  <Skeleton className="ml-auto h-4 w-24" />

                  <Skeleton className="h-4 w-10" />

                  <Skeleton className="h-4 w-20" />
                </div>
              ))}
            </div>

            <div className="flex justify-end">
              <Skeleton className="h-5 w-24" />
            </div>
          </CardContent>
        ))}
      </Card>
    </div>
  );
}
