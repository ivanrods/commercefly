import { CarouselBanners } from "@/src/components/layout/carousel-banners";
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
    <main className="space-y-16 p-4 md:px-16">
      <CarouselBanners />

      <div className=" grid items-center gap-4 grid-cols-1 md:grid-cols-2  lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => {
          return <ProductCard key={product.id} product={product} />;
        })}
      </div>

      <div>
        {categories.map((category) => (
          <div key={category.id}>{category.name}</div>
        ))}
      </div>
    </main>
  );
}
