import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import Link from "next/link";
import { searchProducts } from "@/services/product-service";
import { ProductCard } from "../components/product-card";

export const metadata = {
  title: "Buscar | Commercefly",
  description:
    "Busque produtos na Commercefly e encontre exatamente o que você procura.",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const { q, page } = params;
  const query = Array.isArray(q) ? q[0] : q;

  const { products, totalPages } = await searchProducts({
    query: query || "",
    page: page ? Number(page) : 1,
    limit: 12,
  });

  return (
    <section className="p-4 md:p-0">
      <header className="mx-auto mb-12">
        <div className="flex flex-col items-center justify-between gap-6 text-center md:flex-row md:text-start">
          <div className="space-y-4">
            <div className="inline-flex">
              <span className="bg-secondary/80 text-secondary-foreground rounded-full px-4 py-1.5 text-sm font-medium">
                Resultados de busca
              </span>
            </div>
            <div className="space-y-2">
              <h2 className="text-foreground text-3xl font-bold tracking-tight md:text-4xl">
                {query ? `Buscando por: "${query}"` : "Buscar produtos"}
              </h2>
              <p className="text-muted-foreground max-w-2xl">
                {products.length > 0
                  ? `Encontramos ${products.length} produto(s) correspondendo à sua busca.`
                  : "Nenhum produto encontrado para sua busca."}
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

      {products.length > 0 ? (
        <>
          <div className="grid grid-cols-1 mb-8 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:gap-6 xl:grid-cols-6">
            {products.map((product) => {
              return (
                <ProductCard
                  key={product.id}
                  product={product}
                  id={product.id}
                />
              );
            })}
          </div>

          {totalPages > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href={`?q=${query}&page=${Math.max(1, Number(page) - 1)}`}
                  />
                </PaginationItem>

                {Array.from({ length: totalPages }).map((_, index) => {
                  const pageNumber = index + 1;

                  return (
                    <PaginationItem key={pageNumber}>
                      <PaginationLink
                        href={`?q=${query}&page=${pageNumber}`}
                        isActive={pageNumber === Number(page)}
                      >
                        {pageNumber}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}

                <PaginationItem>
                  <PaginationNext
                    href={`?q=${query}&page=${Math.min(totalPages, Number(page) + 1)}`}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      ) : (
        <div className="text-center py-16">
          <p className="text-muted-foreground text-lg mb-6">
            Tente usar palavras-chave diferentes ou navegue por nossas
            categorias.
          </p>
          <Link href="/product">
            <Button className="cursor-pointer gap-2" size="lg">
              Ver todos os produtos
              <ArrowRight className="size-4" />
            </Button>
          </Link>
        </div>
      )}
    </section>
  );
}
