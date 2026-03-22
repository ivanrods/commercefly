"use client";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "src/components/ui/button";
import { Card, CardContent } from "src/components/ui/card";

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
    <Card className="p-0 shadow-none  border-0 md:border  overflow-hidden ">
      <Link href={`/product/${id}`} className=" ">
        <div className="flex items-center gap-2 p-2 border-b md:border-none md:flex-col md:p-0 md:w-full ">
          <div className="md:w-full md:bg-neutral-100 ">
            <div className="relative w-28 h-28  md:w-72 md:h-72 mx-auto">
              <Image src={product.imageUrl} alt={product.name} fill />
            </div>
          </div>

          <CardContent className="p-0 w-full flex flex-col gap-2 md:p-4">
            <p className="text-lg md:text-xl font-semibold">{product.name}</p>
            <p className=" text-sm  text-neutral-500 line-clamp-2">
              {product.description}
            </p>
            <div className="w-full flex justify-between items-center md:block md:space-y-2">
              <p className="mt-2 text-md md:text-lg font-bold">
                {formatCurrency(product.price)}
              </p>
              <Button onClick={() => addItem(product.id)} className="md:w-full">
                <span className="hidden md:block ">Adicionar</span>{" "}
                <ShoppingCart />
              </Button>
            </div>
          </CardContent>
        </div>
      </Link>
    </Card>
  );
}
