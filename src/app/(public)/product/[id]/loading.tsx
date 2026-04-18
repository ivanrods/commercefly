import { Skeleton } from "src/components/ui/skeleton";

export default function Loading() {
  return (
    <section className="@container mx-auto  max-w-7xl md:mt-32">
      <div className="grid grid-cols-1 gap-6 p-4 lg:grid-cols-2 lg:gap-8 lg:p-6 xl:grid-cols-3 xl:gap-12 xl:p-12">
        <div className="flex flex-col justify-between gap-6 lg:gap-8">
          <div className="space-y-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-6 w-32" />
          </div>

          <div className="flex gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="size-16 rounded-sm" />
            ))}
          </div>
        </div>

        <div className="row-span-2 row-start-1 aspect-square lg:col-start-2">
          <Skeleton className="h-full w-full rounded-lg" />
        </div>

        <div className="flex flex-col gap-6 lg:gap-10">
          <Skeleton className="h-6 w-24" />

          <div className="space-y-2">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-24" />
          </div>

          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-20" />
          </div>

          <div className="space-y-2">
            <Skeleton className="h-4 w-28" />
            <div className="flex gap-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="size-5 rounded-full" />
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Skeleton className="h-12 w-full rounded-full" />
            <Skeleton className="h-12 w-full rounded-md" />
          </div>
        </div>
      </div>
    </section>
  );
}
