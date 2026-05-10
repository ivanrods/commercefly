"use client";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/helpers/format-currency";

import { Product } from "@/types/product-type";
import { useRemoveLike } from "@/hooks/use-likes";

interface LikesProductCardProps {
  product: Product;
}

export default function LikesProductCard({ product }: LikesProductCardProps) {
  const { mutate: removeLike, isPending: isRemovingLike } = useRemoveLike();

  return (
    <Card
      key={product.id}
      className="flex flex-col gap-4 overflow-hidden rounded-lg py-4 shadow-none transition-shadow duration-300 hover:shadow-md"
    >
      <CardContent className="flex flex-1 flex-col gap-4 px-4">
        <div className="aspect-square overflow-hidden relative">
          <Link href={`/product/${product.id}`} className="block size-full">
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
          onClick={() => removeLike(product.id)}
          disabled={isRemovingLike}
        >
          Remover dos favoritos
        </Button>
      </CardFooter>
    </Card>
  );
}
