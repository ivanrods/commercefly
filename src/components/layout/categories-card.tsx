import Link from "next/link";
import { Button } from "@/components/ui/button";

type CategoryCardProps = {
  id: string;
  name: string;
  slug: string;
};

export function CategoryCard({ name, slug }: CategoryCardProps) {
  return (
    <Button asChild variant="outline">
      <Link href={`/category/${slug}`}>{name}</Link>
    </Button>
  );
}
