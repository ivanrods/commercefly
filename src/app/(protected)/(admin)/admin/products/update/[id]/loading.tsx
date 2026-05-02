import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="max-w-xl mx-auto px-4 animate-pulse">
      <FieldSet>
        <div>
          <Skeleton className="h-4 w-64 rounded-md" />
        </div>
        <div>
          <Skeleton className="h-4 w-64 rounded-md" />
        </div>

        <FieldGroup className="mt-4 space-y-4">
          <Field>
            <FieldLabel>
              <Skeleton className="h-4 w-32 rounded-md" />
            </FieldLabel>
            <Skeleton className="h-10 w-full rounded-md" />
          </Field>

          <Field>
            <FieldLabel>
              <Skeleton className="h-4 w-32 rounded-md" />
            </FieldLabel>
            <Skeleton className="h-24 w-full rounded-md" />
          </Field>

          <Field>
            <FieldLabel>
              <Skeleton className="h-4 w-24 rounded-md" />
            </FieldLabel>
            <Skeleton className="h-10 w-1/2 rounded-md" />
          </Field>

          <Field>
            <FieldLabel>
              <Skeleton className="h-4 w-24 rounded-md" />
            </FieldLabel>
            <Skeleton className="h-10 w-full rounded-md" />
          </Field>

          <Field>
            <FieldLabel>
              <Skeleton className="h-4 w-24 rounded-md" />
            </FieldLabel>
            <Skeleton className="h-10 w-1/4 rounded-md" />
          </Field>

          <Field>
            <FieldLabel>
              <Skeleton className="h-4 w-32 rounded-md" />
            </FieldLabel>
            <Skeleton className="h-10 w-full rounded-md" />
          </Field>

          <Field orientation="horizontal" className="items-center space-x-2">
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="h-4 w-32 rounded-md" />
          </Field>

          <Button disabled className="w-full">
            <Skeleton className="h-10 w-full rounded-md" />
          </Button>
        </FieldGroup>
      </FieldSet>
    </div>
  );
}
