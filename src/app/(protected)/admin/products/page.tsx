import { getProducts } from "src/services/product-service";
import { ProductsTable } from "./products-table";

export default async function Page() {
  const { products } = await getProducts({
    page: 1,
    limit: 12,
  });
  return (
    <div className="w-full p-4">
      <ProductsTable products={products} />
    </div>
  );
}
