import { getCategories } from "src/services/category-service";
import { CategoriesTable } from "./categories-table";

export default async function Page() {
  const { categories } = await getCategories({
    page: 1,
    limit: 30,
  });
  return (
    <div className="w-full p-4">
      <CategoriesTable categories={categories} />
    </div>
  );
}
