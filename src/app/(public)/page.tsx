import { getCategories } from "src/services/category-service";
import { getProducts } from "src/services/product-service";
import {
  Carousel,
  CarouselContent,
  CarouselNext,
  CarouselPrevious,
} from "src/components/ui/carousel";
import { CategoryCard } from "./components/categories-card";
import { ProductCard } from "./components/product-card";
import StorefrontHero from "src/app/(public)/components/storefront-hero";

export default async function HomePage() {
  const { products } = await getProducts({
    page: 1,
    limit: 8,
  });

  const categories = await getCategories();

  return (
    <main className="space-y-4 p-4 md:px-16 ">
      <StorefrontHero />
      <Carousel className="w-full ">
        <CarouselContent className="flex gap-2 px-4">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              id={category.id}
              name={category.name}
              slug={category.slug}
            />
          ))}
        </CarouselContent>

        <CarouselPrevious />
        <CarouselNext />
      </Carousel>

      <section className="w-full px-8 py-12">
        <h2 className="mb-8 text-center text-2xl font-bold text-balance md:text-3xl">
          As melhores ofertas de hoje para você!
        </h2>
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
