import {
  Carousel,
  CarouselContent,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { CarouselBanners } from "@/src/components/layout/carousel-banners";
import { CategoryCard } from "@/src/components/layout/categories-card";
import { ProductCard } from "@/src/components/layout/product-card";
import { getCategories } from "@/src/services/category-service";
import { getProducts } from "@/src/services/product-service";

export default async function HomePage() {
  const { products } = await getProducts({
    page: 1,
    limit: 8,
  });

  const categories = await getCategories();

  return (
    <main className="space-y-16 p-4 md:px-16 ">
      <CarouselBanners />

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

      <div className=" grid items-center gap-4 grid-cols-1 md:grid-cols-2  lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => {
          return <ProductCard key={product.id} product={product} />;
        })}
      </div>
    </main>
  );
}
