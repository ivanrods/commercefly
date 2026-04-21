"use client";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { toast } from "sonner";
import { formatCurrency } from "@/helpers/format-currency";
import { useAddCart } from "@/hooks/use-cart";

import { Product } from "@/types/product-type";

type ProductCardProps = {
  product: Product;
  id: string;
};

export function ProductCard({ product, id }: ProductCardProps) {
  const { mutate: addItem } = useAddCart();
  const { isSignedIn, isLoaded } = useUser();

  function handleAddToCart() {
    if (!isLoaded) return;

    if (!isSignedIn) {
      toast.error("Faça login para adicionar ao carrinho", {
        position: "top-center",
      });
      return;
    }

    addItem(product.id);
  }

  return (
    <Card
      key={product.id}
      className="flex flex-col gap-4 overflow-hidden rounded-lg py-4 shadow-none transition-shadow duration-300 hover:shadow-md"
    >
      <CardContent className="flex flex-1 flex-col gap-4 px-4">
        <div className="aspect-square overflow-hidden relative">
          <Link href={`/product/${id}`} className="block size-full">
            <Image
              src={product.images[0]?.url || "/placeholder.svg"}
              alt={product.name}
              fill
              className="rounded-md object-contain"
              sizes="(max-width: 768px) 100vw, 400px"
              priority={false}
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
              {formatCurrency(product.price + product.price * 0.05)}
            </p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="px-3 md:px-4">
        <Button
          variant="outline"
          size="sm"
          className="w-full cursor-pointer text-sm"
          onClick={handleAddToCart}
        >
          {" "}
          Adicionar ao carrinho
        </Button>
      </CardFooter>
    </Card>
  );
}
