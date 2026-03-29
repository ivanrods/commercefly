import { LucideIcon } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "src/components/ui/card";

type CategoryCardProps = {
  id: string;
  name: string;
  slug: string;
  Icon: LucideIcon;
};

export function CategoryCard({ name, slug, Icon }: CategoryCardProps) {
  return (
    <Card className="group relative overflow-hidden shadow-xs transition-all hover:shadow-md">
      <CardContent>
        <Link href={`/category/${slug}`}>
          <div className="space-y-4">
            <div className="bg-secondary/80 text-secondary-foreground flex size-12 items-center justify-center rounded-lg">
              <Icon className="size-5" strokeWidth={1.5} />
            </div>

            <div>
              <h3 className="text-foreground text-lg font-semibold">{name}</h3>
              <p className="text-muted-foreground text-sm">Ver produtos</p>
            </div>
          </div>
        </Link>
      </CardContent>
    </Card>
  );
}
