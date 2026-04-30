import { getCategories } from "@/services/category-service";
import NewProductForm from "./new-product-form";

export default async function NewProductPage() {
  const { categories } = await getCategories({
    page: 1,
    limit: 20,
  });

  return <NewProductForm categories={categories} />;
}
