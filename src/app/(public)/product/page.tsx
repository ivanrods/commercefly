import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { getProducts } from "@/services/product-service";
const { categories } = await getCategories({ limit: 0 });
import { ProductCard } from "../components/product-card";
import ProductFilter from "../components/product-filter";
import { getCategories } from "@/services/category-service";

export const metadata = {
  title: "Produtos | Commercefly",
  description:
    "Explore nossa seleção completa de produtos com alta qualidade e preços acessíveis na Commercefly.",
};

export default async function ProductPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const { page } = params;
  const { products, totalPages } = await getProducts({
    page: page ? Number(page) : 1,
    limit: 12,
  });

  return (
    <section className=" p-4 md:p-0 space-y-8">
      <ProductFilter
        categories={categories.map((category) => ({
          id: category.id,
          name: category.name,
          count: category._count.products,
        }))}
      />

      <div className="grid grid-cols-1 mb-8 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:gap-6 xl:grid-cols-6 ">
        {products.map((product) => {
          return (
            <ProductCard key={product.id} product={product} id={product.id} />
          );
        })}
      </div>

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href={`?page=${Math.max(1, Number(page) - 1)}`}
            />
          </PaginationItem>

          {Array.from({ length: totalPages }).map((_, index) => {
            const pageNumber = index + 1;

            return (
              <PaginationItem key={pageNumber}>
                <PaginationLink
                  href={`?page=${pageNumber}`}
                  isActive={pageNumber === Number(page)}
                >
                  {pageNumber}
                </PaginationLink>
              </PaginationItem>
            );
          })}

          <PaginationItem>
            <PaginationNext
              href={`?page=${Math.min(totalPages, Number(page) + 1)}`}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </section>
  );
}
