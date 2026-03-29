import { getCategories } from "src/services/category-service";
import { getProducts } from "src/services/product-service";
import * as LucideIcons from "lucide-react";
import { CategoryCard } from "./components/categories-card";
import { ProductCard } from "./components/product-card";
import StorefrontHero from "src/app/(public)/components/storefront-hero";
import Link from "next/link";
import { Button } from "src/components/ui/button";
import { ArrowRight } from "lucide-react";

type IconName = keyof typeof LucideIcons;

export default async function HomePage() {
  const { products } = await getProducts({
    page: 1,
    limit: 10,
  });

  const { categories } = await getCategories({
    page: 1,
    limit: 8,
  });

  return (
    <main className="space-y-4 p-4 md:px-16 ">
      <StorefrontHero />

      <section className="relative w-full py-12 md:py-16 lg:py-20">
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
                <ArrowRight className="ms-2" />
              </Button>
            </div>
          </header>

          <div className="mx-auto grid max-w-5xl grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {categories.map((category) => {
              const Icon =
                LucideIcons[category.imageUrl as IconName] ?? LucideIcons.X;

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

      <section className="w-full px-8 py-12">
        <header className="mx-auto mb-12 ">
          <div className="flex flex-col items-center justify-between gap-6 text-center md:flex-row md:text-start">
            <div className="space-y-4">
              <div className="inline-flex">
                <span className="bg-secondary/80 text-secondary-foreground rounded-full px-4 py-1.5 text-sm font-medium">
                  Lista de produtos
                </span>
              </div>
              <div className="space-y-2">
                <h2 className="text-foreground text-3xl font-bold tracking-tight md:text-4xl">
                  Podutos recentes
                </h2>
                <p className="text-muted-foreground max-w-2xl">
                  Lista dos pordutos mais recentes para explorar e adiconar ao
                  carrinho.
                </p>
              </div>
            </div>
            <Link href="/product">
              <Button className="cursor-pointer whitespace-nowrap" size="lg">
                Ver todos os produtos
                <ArrowRight className="ms-2" />
              </Button>
            </Link>
          </div>
        </header>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:gap-6 xl:grid-cols-6">
          {products.map((product) => {
            return (
              <ProductCard key={product.id} product={product} id={product.id} />
            );
          })}
        </div>
      </section>
    </main>
  );
}
