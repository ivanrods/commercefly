import { getCategories } from "src/services/category-service";
import { getProducts } from "src/services/product-service";

import { CategoryCard } from "./components/categories-card";
import { ProductCard } from "./components/product-card";
import StorefrontHero from "src/app/(public)/components/storefront-hero";
import Link from "next/link";
import { Button } from "src/components/ui/button";
import { ArrowRight } from "lucide-react";

export default async function HomePage() {
  const { products } = await getProducts({
    page: 1,
    limit: 10,
  });

  return (
    <main className="space-y-4 p-4 md:px-16 ">
      <StorefrontHero />
      <CategoryCard />
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
