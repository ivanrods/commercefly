import * as LucideIcons from "lucide-react";
import Link from "next/link";
import { Button } from "src/components/ui/button";
import { Card, CardContent } from "src/components/ui/card";
import { cn } from "src/lib/utils";

// Create a type for valid icon names
type IconName = keyof typeof LucideIcons;

interface Category {
  id: string;
  name: string;
  slug: string;
  icon: IconName;
}

const categories = [
  { id: "1", name: "Pet Shop", slug: "pet-shop", icon: "Dog" },
  { id: "2", name: "Saúde", slug: "saude", icon: "HeartPulse" },
  {
    id: "3",
    name: "Alimentos e Bebidas",
    slug: "alimentos-e-bebidas",
    icon: "Utensils",
  },
  { id: "4", name: "Móveis", slug: "moveis", icon: "Sofa" },
  { id: "5", name: "Joias", slug: "joias", icon: "Gem" },
  { id: "6", name: "Moda Infantil", slug: "moda-infantil", icon: "Baby" },
  { id: "7", name: "Moda Masculina", slug: "moda-masculina", icon: "User" },
  {
    id: "8",
    name: "Moda Feminina",
    slug: "moda-feminina",
    icon: "ShoppingBag",
  },
] as const satisfies readonly Category[];

export function CategoryCard({ className }: { className?: string }) {
  return (
    <section
      className={cn("relative w-full py-12 md:py-16 lg:py-20", className)}
    >
      <div className="relative z-10 container mx-auto px-4 md:px-6">
        <header className="mx-auto mb-12 max-w-5xl">
          <div className="flex flex-col items-center justify-between gap-6 text-center md:flex-row md:text-start">
            <div className="space-y-4">
              <div className="inline-flex">
                <span className="bg-secondary/80 text-secondary-foreground rounded-full px-4 py-1.5 text-sm font-medium">
                  Lista de categorias
                </span>
              </div>
              <div className="space-y-2">
                <h2 className="text-foreground text-3xl font-bold tracking-tight md:text-4xl">
                  Lista popular
                </h2>
                <p className="text-muted-foreground max-w-2xl">
                  Explore nossa coleção exclusiva de produtos. Cada peça é
                  escolhida a dedo para quem aprecia qualidade e estilo.
                </p>
              </div>
            </div>
            <Button className="cursor-pointer whitespace-nowrap" size="lg">
              Ver todas as categorias
              <LucideIcons.ArrowRight className="ms-2" />
            </Button>
          </div>
        </header>

        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((category) => {
            const Icon = LucideIcons[category.icon] || LucideIcons["X"];
            return (
              <Card
                key={category.id}
                className="group relative overflow-hidden shadow-xs transition-all hover:shadow-md"
              >
                <CardContent>
                  <Link href={`/category/${category.slug}`}>
                    <div className="space-y-4">
                      <div className="bg-secondary/80 text-secondary-foreground flex size-12 items-center justify-center rounded-lg">
                        <Icon className="size-5" strokeWidth={1.5} />
                      </div>
                      <div>
                        <h3 className="text-foreground text-lg font-semibold">
                          {category.name}
                        </h3>
                        <p className="text-muted-foreground text-sm">
                          Ver produtos
                        </p>
                      </div>
                    </div>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
