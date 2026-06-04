// Suspense é necessário pois ProductFilter usa useSearchParams (client component)
import { Suspense } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { getProducts } from "@/services/product-service";
import { ProductCard } from "../components/product-card";
import ProductFilter from "../components/product-filter";
import { getCategories } from "@/services/category-service";

const { categories } = await getCategories({ limit: 0 });

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
  // lê todos os filtros da URL (searchParams) — fonte única da verdade
  const params = await searchParams;
  const page = (params.page as string) || "1";
  const category = (params.category as string) || "";
  const search = (params.search as string) || "";
  const price = (params.price as string) || "";
  const sort = (params.sort as string) || "";

  // converte o ID da faixa de preço da URL em valores numéricos min/max para o service
  const priceRangeMap: Record<string, { min: number; max: number | null }> = {
    "under-25": { min: 0, max: 25 },
    "25-50": { min: 25, max: 50 },
    "50-100": { min: 50, max: 100 },
    "over-100": { min: 100, max: null },
  };

  const range = priceRangeMap[price];
  const priceMin = range?.min;
  const priceMax = range?.max !== undefined && range?.max !== null ? range.max : undefined;

  const { products, total, totalPages } = await getProducts({
    page: Number(page),
    limit: 12,
    category: category || undefined,
    search: search || undefined,
    priceMin,
    priceMax,
    sort: sort || undefined,
  });

  const currentPage = Number(page);

  // gera href da paginação preservando todos os filtros ativos
  function href(pageNum: number) {
    const p = new URLSearchParams();
    if (pageNum > 1) p.set("page", String(pageNum));
    if (category) p.set("category", category);
    if (search) p.set("search", search);
    if (price) p.set("price", price);
    if (sort) p.set("sort", sort);
    return p.toString() ? `?${p.toString()}` : "?";
  }

  return (
    <section className=" p-4 md:p-0 space-y-8">
      <Suspense
        fallback={
          <div className="animate-pulse h-40 bg-muted rounded-lg" />
        }
      >
        <ProductFilter
          categories={categories.map((category) => ({
            id: category.id,
            name: category.name,
            count: category._count.products,
          }))}
          totalResults={total}
        />
      </Suspense>

      <div className="grid grid-cols-1 mb-8 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 lg:gap-6">
        {products.map((product) => {
          return (
            <ProductCard key={product.id} product={product} id={product.id} />
          );
        })}
      </div>

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href={href(Math.max(1, currentPage - 1))} />
          </PaginationItem>

          {Array.from({ length: totalPages }).map((_, index) => {
            const pageNumber = index + 1;

            return (
              <PaginationItem key={pageNumber}>
                <PaginationLink
                  href={href(pageNumber)}
                  isActive={pageNumber === currentPage}
                >
                  {pageNumber}
                </PaginationLink>
              </PaginationItem>
            );
          })}

          <PaginationItem>
            <PaginationNext
              href={href(Math.min(totalPages, currentPage + 1))}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </section>
  );
}
