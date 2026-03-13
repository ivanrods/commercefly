import { getCategories } from "src/services/category-service";
import { getProducts } from "src/services/product-service";
import { CarouselBanners } from "./components/carousel-banners";
import {
  Carousel,
  CarouselContent,
  CarouselNext,
  CarouselPrevious,
} from "src/components/ui/carousel";
import { CategoryCard } from "./components/categories-card";
import { ProductCard } from "./components/product-card";

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

      <div className=" grid items-center gap-4 grid-cols-1 md:grid-cols-3  lg:grid-cols-4 xl:grid-cols-5">
        {products.map((product) => {
          return (
            <ProductCard key={product.id} product={product} id={product.id} />
          );
        })}
      </div>
    </main>
  );
}
