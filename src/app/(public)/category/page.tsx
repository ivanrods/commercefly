import { getCategories } from "src/services/category-service";

import * as LucideIcons from "lucide-react";
import { LucideIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "src/components/ui/button";
import { ArrowRight } from "lucide-react";
import { CategoryCard } from "../components/categories-card";

type IconName = keyof typeof LucideIcons;

export default async function HomePage() {
  const { categories } = await getCategories({
    page: 1,
    limit: 20,
  });

  return (
    <section className="relative w-full py-4 md:py-16 lg:py-20">
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
                  Todas as categorias
                </h2>
                <p className="text-muted-foreground max-w-2xl">
                  Explore nossa coleção exclusiva de produtos. Cada peça é
                  escolhida a dedo para quem aprecia qualidade e estilo.
                </p>
              </div>
            </div>
            <Link href="/">
              <Button className="cursor-pointer whitespace-nowrap" size="lg">
                Voltar para a página inicial
                <ArrowRight className="ms-2" />
              </Button>
            </Link>
          </div>
        </header>

        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((category) => {
            const Icon = (LucideIcons[category.imageUrl as IconName] ??
              LucideIcons.X) as LucideIcon;

            return (
              <CategoryCard
                key={category.id}
                id={category.id}
                name={category.name}
                slug={category.slug}
                Icon={Icon}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
