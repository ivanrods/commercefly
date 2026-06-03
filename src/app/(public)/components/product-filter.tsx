"use client";

import { useState } from "react";
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

const priceRanges = [
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
}

export default function ProductFilter({ categories }: ProductFilterProps) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPriceRange, setSelectedPriceRange] = useState("all");
  const [selectedSort, setSelectedSort] = useState("featured");
  const [searchQuery, setSearchQuery] = useState("");

  const activeFilters = [];
  if (selectedCategory !== "all") {
    const category = categories.find((c) => c.id === selectedCategory);
    if (category)
      activeFilters.push({
        type: "category",
        label: category.name,
        value: selectedCategory,
      });
  }
  if (selectedPriceRange !== "all") {
    const priceRange = priceRanges.find((p) => p.id === selectedPriceRange);
    if (priceRange)
      activeFilters.push({
        type: "price",
        label: priceRange.label,
        value: selectedPriceRange,
      });
  }
  if (searchQuery) {
    activeFilters.push({
      type: "search",
      label: `"${searchQuery}"`,
      value: searchQuery,
    });
  }

  const clearFilter = (type: string) => {
    if (type === "category") setSelectedCategory("all");
    if (type === "price") setSelectedPriceRange("all");
    if (type === "search") setSearchQuery("");
  };

  const clearAllFilters = () => {
    setSelectedCategory("all");
    setSelectedPriceRange("all");
    setSearchQuery("");
  };

  return (
    <section className="">
      <div className="mx-auto w-full ">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold tracking-tight text-balance">
            Lista de produtos
          </h2>
          <p className="text-muted-foreground mt-2">
            Procure por{" "}
            {categories.find((c) => c.id === selectedCategory)?.count || 1247}{" "}
            produtos
          </p>
        </div>

        {/* Horizontal Filter Bar */}
        <div className="mb-6 flex flex-col gap-4">
          {/* Search and Sort Row */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Search */}
            <div className="relative max-w-md flex-1">
              <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
              <Input
                placeholder="Buscar produtos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-9"
              />
            </div>

            {/* Sort Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="h-9 px-4 py-2 w-full cursor-pointer sm:w-auto"
                >
                  <SlidersHorizontal data-icon="inline-start" />
                  Ordenar por{" "}
                  {sortOptions.find((s) => s.id === selectedSort)?.label}
                  <ChevronDown data-icon="inline-end" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {sortOptions.map((option) => (
                  <DropdownMenuItem
                    key={option.id}
                    onClick={() => setSelectedSort(option.id)}
                    className={selectedSort === option.id ? "bg-accent" : ""}
                  >
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Category and Price Filter Row */}
          <div className="flex flex-wrap gap-3">
            {/* Category Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 px-3 text-xs cursor-pointer"
                >
                  Categoria:{" "}
                  {categories.find((c) => c.id === selectedCategory)?.name}
                  <ChevronDown data-icon="inline-end" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                {categories.map((category) => (
                  <DropdownMenuItem
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={
                      selectedCategory === category.id ? "bg-accent" : ""
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

            {/* Price Range Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 px-3 text-xs cursor-pointer"
                >
                  Preço:{" "}
                  {priceRanges.find((p) => p.id === selectedPriceRange)?.label}
                  <ChevronDown data-icon="inline-end" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48">
                {priceRanges.map((range) => (
                  <DropdownMenuItem
                    key={range.id}
                    onClick={() => setSelectedPriceRange(range.id)}
                    className={
                      selectedPriceRange === range.id ? "bg-accent" : ""
                    }
                  >
                    {range.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Active Filters */}
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

        {/* Results Summary */}
        <div className="bg-muted/50 rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">
                Exibindo{" "}
                {categories.find((c) => c.id === selectedCategory)?.count ||
                  1247}{" "}
                resultados
              </span>
              {searchQuery && (
                <span className="text-muted-foreground text-sm">
                  para {searchQuery}
                </span>
              )}
            </div>
            <div className="text-muted-foreground text-xs">
              Ordenado por{" "}
              {sortOptions.find((s) => s.id === selectedSort)?.label}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
