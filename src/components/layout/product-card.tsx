"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { useCartStore } from "@/src/store/cart-store";
import { Product } from "@/src/types/product-type";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type ProductCardProps = {
  product: Product;
  id: string;
};

export function ProductCard({ product, id }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  return (
    <Card>
      <Link href={`/product/${id}`}>
        <CardHeader>
          <Image
            src={product.imageUrl}
            alt={product.name}
            width={400}
            height={400}
          />
        </CardHeader>

        <CardContent>
          <p className="text-lg md:text-xl font-semibold">{product.name}</p>
          <p className=" text-base md:text-sm text-neutral-500">
            {product.description}
          </p>
          <p className="mt-2 text-md md:text-lg font-bold">${product.price}</p>
        </CardContent>
      </Link>
      <CardFooter className="pb-4">
        <Button
          variant="default"
          className="w-full"
          onClick={() =>
            addItem({
              ...product,
              quantity: 1,
            })
          }
        >
          Adicionar <ShoppingCart />
        </Button>
      </CardFooter>
    </Card>
  );
}
