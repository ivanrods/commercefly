import { MoveRight, Store } from "lucide-react";
import Image from "next/image";

import Link from "next/link";
import { Badge } from "src/components/ui/badge";
import { Button } from "src/components/ui/button";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "src/components/ui/carousel";
import { formatCurrency } from "src/helpers/format-currency";
import { cn } from "src/lib/utils";
import { getProductById } from "src/services/product-service";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ProductPage({ params }: Props) {
  const { id } = await params;

  const product = await getProductById(id);

  if (!product) {
    return <div>product not found</div>;
  }

  return (
    <div>
      <section className="@container mx-auto max-w-7xl md:mt-32">
        <div className="grid grid-cols-1 gap-6 p-4 lg:grid-cols-2 lg:gap-8 lg:p-6 xl:grid-cols-3 xl:gap-12 xl:p-12">
          <div className="flex flex-col justify-between gap-6 lg:gap-8">
            <div className="space-y-2 lg:space-y-4">
              <span className="text-sm font-semibold tracking-wide uppercase">
                CommerceFly
              </span>
              <h2 className="text-xl font-bold tracking-tight text-balance lg:text-3xl">
                {product.name}
              </h2>
              <p className="text-muted-foreground text-balance">
                {product.description}
              </p>
              <p className="text-2xl font-bold tracking-tight">
                {formatCurrency(product.price)}
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <div
                key={product.id}
                className={cn(
                  "ring-offset-background size-16 lg:size-18 cursor-pointer overflow-hidden rounded-sm ring-offset-2 transition-all relative",
                )}
              >
                <Image
                  src={product.images[0]?.url ?? ""}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="72px"
                />
              </div>
            </div>
          </div>

          <div className="row-span-2 row-start-1 aspect-square lg:col-start-2">
            <Carousel className="size-full">
              <CarouselContent>
                <CarouselItem key={product.id}>
                  <div className="relative w-full aspect-square">
                    <Image
                      src={product.images[0]?.url ?? ""}
                      alt={product.name}
                      fill
                      className="rounded-lg object-cover"
                      sizes="100vw"
                    />
                  </div>
                </CarouselItem>
              </CarouselContent>
            </Carousel>
          </div>

          <div className="flex flex-col gap-6 lg:gap-10">
            {product.isFeatured && <Badge>Featured</Badge>}

            <div className="space-y-2">
              <h3 className="font-bold">Estoque disponível</h3>
              <div className="flex flex-wrap gap-3">
                Produtos: {product.stock}
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-bold">Categoria</h3>
              <div className="flex space-x-1">{product.category.name}</div>
            </div>

            <Button className=" cursor-pointer rounded-full" size="lg">
              Add to Cart
            </Button>
            <Link href="/">
              <Button variant="outline" className="w-full cursor-pointer">
                <Store className="me-2 size-4" />
                Continuar comprando
                <MoveRight className="ms-2 size-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
