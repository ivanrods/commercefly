import { Skeleton } from "src/components/ui/skeleton";

export default function Loading() {
  return (
    <section className="w-full px-8 py-12">
      <div className="mx-auto mb-12 space-y-4">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-10 w-80" />
        <Skeleton className="h-4 w-125" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:gap-6 xl:grid-cols-6">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="rounded-lg border p-4 space-y-4">
            <Skeleton className="aspect-square w-full rounded-md" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
        ))}
      </div>
    </section>
  );
}
