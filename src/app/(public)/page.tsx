import { CarouselBanners } from "@/src/components/layout/carousel-banners";
import { getCategories } from "@/src/services/category-service";
import { getProducts } from "@/src/services/product-service";

export default async function HomePage() {
  const { products } = await getProducts({
    page: 1,
    limit: 8,
  });

  const categories = await getCategories();

  return (
    <main className="space-y-16 py-4 px-16">
      <CarouselBanners />
      <div>
        {categories.map((category) => (
          <div key={category.id}>{category.name}</div>
        ))}
      </div>
      <div>
        {products.map((product) => (
          <div key={product.id}>{product.name}</div>
        ))}
      </div>
    </main>
  );
}
