"use client";

import { Heart } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/helpers/format-currency";
import LikeButton from "@/app/(public)/components/like-button";
import { useLikes } from "@/hooks/use-likes";
import { Product } from "@/types/product-type";

interface LikesSectionClientProps {
  initialProducts: Product[];
}

export default function LikesSection({
  initialProducts,
}: LikesSectionClientProps) {
  const { data: updatedProducts } = useLikes();
  const products = updatedProducts || initialProducts;

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8 space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Meus Favoritos
        </h1>
        <p className="text-muted-foreground">
          {products.length} produto{products.length !== 1 ? "s" : ""} marcado
          {products.length !== 1 ? "s" : ""} como favorito
        </p>
      </div>

      <div className="flex flex-col gap-8">
        {products.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <Heart className="text-muted-foreground/50 mb-4 size-12" />
              <h3 className="text-lg font-medium">Nenhum favorito ainda</h3>
              <p className="text-muted-foreground mt-1 text-sm">
                Adicione seus produtos favoritos para vê-los aqui.
              </p>
              <Link href="/">
                <Button className="mt-4">Explorar produtos</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product: Product) => (
              <Link key={product.id} href={`/product/${product.id}`}>
                <Card className="overflow-hidden transition-all hover:shadow-lg cursor-pointer h-full flex flex-col">
                  <div className="relative w-full aspect-square overflow-hidden bg-muted">
                    {product.images?.[0]?.url ? (
                      <Image
                        src={product.images[0].url}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform hover:scale-105"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <p className="text-muted-foreground">Sem imagem</p>
                      </div>
                    )}
                  </div>
                  <CardContent className="flex-1 flex flex-col p-4">
                    <h3 className="font-semibold text-sm line-clamp-2">
                      {product.name}
                    </h3>
                    {product.category && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {product.category.name}
                      </p>
                    )}
                    <div className="mt-auto pt-4 space-y-2">
                      <p className="text-lg font-bold">
                        {formatCurrency(product.price)}
                      </p>
                      <div className="flex gap-2">
                        <LikeButton
                          productId={product.id}
                          showCount={true}
                          className="flex-1"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
