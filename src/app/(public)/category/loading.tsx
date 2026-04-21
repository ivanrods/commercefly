import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <section className="relative w-full py-12 md:py-16 lg:py-20">
      <div className="relative z-10 container mx-auto px-4 md:px-6">
        <header className="mx-auto mb-12 max-w-5xl">
          <div className="flex flex-col items-center justify-between gap-6 text-center md:flex-row md:text-start">
            <div className="space-y-4">
              <div className="inline-flex">
                <Skeleton className="h-8 w-40 rounded-full" />
              </div>

              <div className="space-y-2">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-4 w-100" />
                <Skeleton className="h-4 w-87.5" />
              </div>
            </div>

            <Skeleton className="h-12 w-56 rounded-md" />
          </div>
        </header>

        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-3 rounded-lg border p-4"
            >
              <Skeleton className="size-10 rounded-md" />
              <Skeleton className="h-4 w-24" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
