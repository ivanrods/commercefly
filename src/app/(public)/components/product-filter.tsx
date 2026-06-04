"use client";

import { useCallback, useEffect, useRef, useState } from "react";
// hooks do Next.js para navegação e leitura da URL (fonte da verdade dos filtros)
import { useRouter, useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Search, ChevronDown, X, SlidersHorizontal } from "lucide-react";

export const priceRanges = [
  { id: "all", label: "Todos os preços", min: 0, max: null },
  { id: "under-25", label: "Abaixo de R$25", min: 0, max: 25 },
  { id: "25-50", label: "R$25 - R$50", min: 25, max: 50 },
  { id: "50-100", label: "R$50 - R$100", min: 50, max: 100 },
  { id: "over-100", label: "Acima de R$100", min: 100, max: null },
];

const sortOptions = [
  { id: "featured", label: "Destacados" },
  { id: "newest", label: "Mais novos" },
  { id: "price-low", label: "Preço: Do mais baixo ao mais alto" },
  { id: "price-high", label: "Preço: Do mais alto ao mais baixo" },
  { id: "rating", label: "Avaliação dos clientes" },
];

interface ProductFilterProps {
  categories: { id: string; name: string; count: number }[];
  totalResults: number; // total real de produtos da consulta (vindo do server)
}

export default function ProductFilter({
  categories,
  totalResults,
}: ProductFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // valores lidos diretamente da URL (fonte única da verdade)
  const currentCategory = searchParams.get("category") || "all";
  const currentPriceRange = searchParams.get("price") || "all";
  const currentSort = searchParams.get("sort") || "featured";
  const currentSearch = searchParams.get("search") || "";

  // estado local apenas para o input de busca (com debounce na URL)
  const [searchQuery, setSearchQuery] = useState(currentSearch);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  // sincroniza o input quando a URL muda externamente (ex: botão voltar)
  useEffect(() => {
    setSearchQuery(currentSearch);
  }, [currentSearch]);

  // atualiza a URL com um ou mais parâmetros; reseta page para 1
  const updateURL = useCallback(
    (updates: Record<string, string | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
      });

      // qualquer mudança de filtro volta para a primeira página
      params.delete("page");
      router.replace(`?${params.toString()}`);
    },
    [router, searchParams],
  );

  // busca com debounce de 300ms para não sobrecarregar a navegação
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      updateURL({ search: value || undefined });
    }, 400);
  };

  // muda categoria e já navega (sem debounce)
  const handleCategoryChange = (value: string) => {
    updateURL({ category: value !== "all" ? value : undefined });
  };

  // muda faixa de preço e já navega
  const handlePriceChange = (value: string) => {
    updateURL({ price: value !== "all" ? value : undefined });
  };

  // muda ordenação e já navega
  const handleSortChange = (value: string) => {
    updateURL({ sort: value !== "featured" ? value : undefined });
  };

  // constrói lista de filtros ativos baseada na URL (não em estado local)
  const activeFilters: { type: string; label: string }[] = [];
  if (currentCategory !== "all") {
    const category = categories.find((c) => c.id === currentCategory);
    if (category)
      activeFilters.push({ type: "category", label: category.name });
  }
  if (currentPriceRange !== "all") {
    const range = priceRanges.find((p) => p.id === currentPriceRange);
    if (range) activeFilters.push({ type: "price", label: range.label });
  }
  if (currentSearch) {
    activeFilters.push({ type: "search", label: `"${currentSearch}"` });
  }

  // remove um filtro específico da URL
  const clearFilter = (type: string) => {
    if (type === "category") updateURL({ category: undefined });
    if (type === "price") updateURL({ price: undefined });
    if (type === "search") {
      setSearchQuery("");
      updateURL({ search: undefined });
    }
  };

  // limpa todos os filtros (navega para "?" sem parâmetros)
  const clearAllFilters = () => {
    setSearchQuery("");
    router.replace("?");
  };

  return (
    <section className="">
      <div className="mx-auto w-full ">
        <div className="mb-8">
          <h2 className="text-3xl font-bold tracking-tight text-balance">
            Lista de produtos
          </h2>
          <p className="text-muted-foreground mt-2">
            Procure por {totalResults} produtos
          </p>
        </div>

        <div className="mb-6 flex flex-col gap-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative max-w-md flex-1">
              <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
              <Input
                placeholder="Buscar produtos..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10 h-9"
              />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="h-9 px-4 py-2 w-full cursor-pointer sm:w-auto"
                >
                  <SlidersHorizontal data-icon="inline-start" />
                  Ordenar por{" "}
                  {sortOptions.find((s) => s.id === currentSort)?.label}
                  <ChevronDown data-icon="inline-end" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {sortOptions.map((option) => (
                  <DropdownMenuItem
                    key={option.id}
                    onClick={() => handleSortChange(option.id)}
                    className={currentSort === option.id ? "bg-accent" : ""}
                  >
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex flex-wrap gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 px-3 text-xs cursor-pointer"
                >
                  Categoria:{" "}
                  {categories.find((c) => c.id === currentCategory)?.name}
                  <ChevronDown data-icon="inline-end" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                {categories.map((category) => (
                  <DropdownMenuItem
                    key={category.id}
                    onClick={() => handleCategoryChange(category.id)}
                    className={
                      currentCategory === category.id ? "bg-accent" : ""
                    }
                  >
                    <div className="flex w-full items-center justify-between">
                      <span>{category.name}</span>
                      <Badge
                        variant="secondary"
                        className="px-2.5 py-0.5 font-semibold text-xs"
                      >
                        {category.count}
                      </Badge>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 px-3 text-xs cursor-pointer"
                >
                  Preço:{" "}
                  {priceRanges.find((p) => p.id === currentPriceRange)?.label}
                  <ChevronDown data-icon="inline-end" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48">
                {priceRanges.map((range) => (
                  <DropdownMenuItem
                    key={range.id}
                    onClick={() => handlePriceChange(range.id)}
                    className={
                      currentPriceRange === range.id ? "bg-accent" : ""
                    }
                  >
                    {range.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {activeFilters.length > 0 ? (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-muted-foreground text-sm font-medium">
                Filters ativas:
              </span>
              {activeFilters.map((filter, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="px-2.5 py-0.5 font-semibold"
                >
                  {filter.label}
                  <Button
                    variant="ghost"
                    size="sm"
                    className=" px-3 text-xs h-auto cursor-pointer p-1 text-inherit"
                    onClick={() => clearFilter(filter.type)}
                  >
                    <X className="size-3" />
                  </Button>
                </Badge>
              ))}
              <DropdownMenuSeparator className="mx-2" />
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className=" px-3 text-xs text-muted-foreground h-auto cursor-pointer p-1.5"
              >
                Limpar tudo
              </Button>
            </div>
          ) : null}
        </div>

        <div className="bg-muted/50 rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">
                Exibindo {totalResults} resultados
              </span>
              {currentSearch && (
                <span className="text-muted-foreground text-sm">
                  para {currentSearch}
                </span>
              )}
            </div>
            <div className="text-muted-foreground text-xs">
              Ordenado por{" "}
              {sortOptions.find((s) => s.id === currentSort)?.label}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
