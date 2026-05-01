import { getCategories } from "@/services/category-service";
import NewProductForm from "./new-product-form";

export default async function NewProductPage() {
  const { categories } = await getCategories({ limit: 0 });

  return <NewProductForm categories={categories} />;
}
