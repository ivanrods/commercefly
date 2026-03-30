"use client";
import Link from "next/link";
import { Button } from "src/components/ui/button";
import { Card, CardContent, CardFooter } from "src/components/ui/card";

import { formatCurrency } from "src/helpers/format-currency";
import { useAddCart } from "src/hooks/use-cart";

import { Product } from "src/types/product-type";

type ProductCardProps = {
  product: Product;
  id: string;
};

export function ProductCard({ product, id }: ProductCardProps) {
  const { mutate: addItem } = useAddCart();

  return (
    <Card
      key={product.id}
      className="flex flex-col gap-4 overflow-hidden rounded-lg py-4 shadow-none transition-shadow duration-300 hover:shadow-md"
    >
      <CardContent className="flex flex-1 flex-col gap-4 px-4">
        {" "}
        <div className="aspect-square overflow-hidden">
          <Link href={`/product/${id}`}>
            <img
              src={product.images[0]?.url ?? ""}
              alt={product.name}
              className="size-full rounded-md object-contain"
              loading="lazy"
              width={400}
              height={400}
            />
            <img
              src="https://ui.shadcn.com/placeholder.svg"
              alt="placeholder image"
              className="rounded-md dark:brightness-[0.95] dark:invert"
            />
          </Link>
        </div>
        <div className="flex flex-1 flex-col">
          <h3 className="mb-1 font-medium text-balance line-clamp-2">
            {product.name}
          </h3>
          <div className="mt-auto flex items-baseline gap-2">
            <p className="font-semibold">{formatCurrency(product.price)}</p>

            <p className="text-muted-foreground text-sm line-through md:text-base xl:text-sm 2xl:text-base">
              {formatCurrency(product.price + 30)}
            </p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="px-3 md:px-4">
        <Button
          variant="outline"
          size="sm"
          className="w-full cursor-pointer text-sm"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            addItem(product.id);
          }}
        >
          {" "}
          Adicionar ao carrinho
        </Button>
      </CardFooter>
    </Card>
  );
}
