import { Skeleton } from "src/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="space-y-4 p-4 md:px-16">
      <Skeleton className="h-75 w-full rounded-xl" />

      <section className="w-full py-12 md:py-16 lg:py-20">
        <div className="mx-auto max-w-5xl space-y-8 px-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-3">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-4 w-100" />
            </div>
            <Skeleton className="h-12 w-52 rounded-md" />
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-24 w-full rounded-lg" />
            ))}
          </div>
        </div>
      </section>

      <section className="w-full px-8 py-12">
        <div className="mx-auto mb-12 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-3">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-100" />
          </div>
          <Skeleton className="h-12 w-52 rounded-md" />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:gap-6 xl:grid-cols-6">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="aspect-square w-full rounded-md" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
