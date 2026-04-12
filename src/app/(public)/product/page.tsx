import { Button } from "src/components/ui/button";
import { ArrowRight } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "src/components/ui/pagination";

import Link from "next/link";
import { getProducts } from "src/services/product-service";
import { ProductCard } from "../components/product-card";

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
    <section className="max-w-screen-2xl mx-auto px-4 py-4 md:px-4">
      <header className="mx-auto mb-12 ">
        <div className="flex flex-col items-center justify-between gap-6 text-center md:flex-row md:text-start">
          <div className="space-y-4">
            <div className="inline-flex">
              <span className="bg-secondary/80 text-secondary-foreground rounded-full px-4 py-1.5 text-sm font-medium">
                Lista de produtos
              </span>
            </div>
            <div className="space-y-2">
              <h2 className="text-foreground text-3xl font-bold tracking-tight md:text-4xl">
                Todos os produtos
              </h2>
              <p className="text-muted-foreground max-w-2xl">
                Lista dos pordutos mais recentes para explorar e adiconar ao
                carrinho.
              </p>
            </div>
          </div>
          <Link href="/">
            <Button className="cursor-pointer whitespace-nowrap" size="lg">
              Voltar para a página inicial
              <ArrowRight className="ms-2" />
            </Button>
          </Link>
        </div>
      </header>

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
