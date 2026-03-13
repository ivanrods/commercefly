import { getCategoryBySlug } from "src/services/category-service";
import { ProductCard } from "../../components/product-card";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;

  const category = await getCategoryBySlug(slug);

  if (!category) {
    return <div>Category not found</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">{category.name}</h1>

      <div className="grid items-center gap-4 grid-cols-1 md:grid-cols-3  lg:grid-cols-4 xl:grid-cols-5">
        {category.products.map((product) => (
          <ProductCard key={product.id} product={product} id={product.id} />
        ))}
      </div>
    </div>
  );
}
