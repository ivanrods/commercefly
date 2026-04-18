"use client";
import { useParams } from "next/navigation";
import { MoveRight, Store } from "lucide-react";
import Image from "next/image";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Badge } from "src/components/ui/badge";
import { Button } from "src/components/ui/button";
import { toast } from "sonner";
import { Star } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "src/components/ui/carousel";

import { formatCurrency } from "src/helpers/format-currency";
import { cn } from "src/lib/utils";
import { Product } from "src/types/product-type";
import { useAddCart } from "src/hooks/use-cart";
import { Skeleton } from "src/components/ui/skeleton";
import { useUser } from "@clerk/nextjs";

/*
export const metadata = {
  title: "Detalhes do Produto | Commercefly",
  description:
    "Veja todas as informações, características e benefícios do produto selecionado na Commercefly.",
};
*/

export default function ProductPage() {
  const params = useParams();
  const id = params.id as string;
  const { mutate: addItem } = useAddCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  const [selectedImage, setSelectedImage] = useState(0);
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();

  const { isSignedIn, isLoaded } = useUser();

  useEffect(() => {
    if (!id) return;
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/products/${id}`);

        if (!res.ok) {
          throw new Error("Erro ao buscar produto");
        }

        const data = await res.json();
        setProduct(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [id]);

  function handleAddToCart() {
    if (!isLoaded) return;

    if (!isSignedIn) {
      toast.error("Faça login para adicionar ao carrinho", {
        position: "top-center",
      });
      return;
    }

    if (!product) {
      toast.error("Produto não encontrado", { position: "top-center" });
      return;
    }

    addItem(product.id);
  }

  useEffect(() => {
    if (!carouselApi) return;

    // Set carousel to the selected image
    carouselApi.scrollTo(selectedImage);

    // Update selected image when carousel changes
    const handleSelect = () => {
      const currentIndex = carouselApi.selectedScrollSnap();
      setSelectedImage(currentIndex);
    };

    carouselApi.on("select", handleSelect);
    return () => {
      carouselApi.off("select", handleSelect);
    };
  }, [carouselApi, selectedImage]);

  if (loading) {
    return (
      <section className="@container mx-auto  max-w-7xl md:mt-32">
        <div className="grid grid-cols-1 gap-6 p-4 lg:grid-cols-2 lg:gap-8 lg:p-6 xl:grid-cols-3 xl:gap-12 xl:p-12">
          <div className="flex flex-col justify-between gap-6 lg:gap-8">
            <div className="space-y-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-6 w-32" />
            </div>

            <div className="flex gap-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="size-16 rounded-sm" />
              ))}
            </div>
          </div>

          <div className="row-span-2 row-start-1 aspect-square lg:col-start-2">
            <Skeleton className="h-full w-full rounded-lg" />
          </div>

          <div className="flex flex-col gap-6 lg:gap-10">
            <Skeleton className="h-6 w-24" />

            <div className="space-y-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-24" />
            </div>

            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-20" />
            </div>

            <div className="space-y-2">
              <Skeleton className="h-4 w-28" />
              <div className="flex gap-2">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="size-5 rounded-full" />
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Skeleton className="h-12 w-full rounded-full" />
              <Skeleton className="h-12 w-full rounded-md" />
            </div>
          </div>
        </div>
      </section>
    );
  }
  if (!product) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4 ">
        <div className="flex max-w-md flex-col items-center gap-4 text-center">
          <div className="bg-muted flex size-16 items-center justify-center rounded-full">
            <Store className="size-8 text-muted-foreground" />
          </div>

          <h2 className="text-2xl font-bold">Produto não encontrado</h2>

          <p className="text-muted-foreground">
            O produto que você está procurando não existe ou foi removido.
          </p>

          <Link href="/">
            <Button className="mt-2">
              Voltar para a loja
              <MoveRight className="ml-2 size-4" />
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <section className="@container mx-auto max-w-7xl md:mt-32 ">
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
              <div className="flex flex-wrap gap-4">
                <div className="flex flex-wrap gap-4">
                  {product.images.map((image, index) => (
                    <div
                      key={image.id}
                      onMouseEnter={() => setSelectedImage(index)}
                      className={cn(
                        "ring-offset-background relative size-16 cursor-pointer overflow-hidden rounded-sm ring-offset-2 transition-all lg:size-18",
                        selectedImage === index && "ring-foreground ring-2",
                      )}
                    >
                      <Image
                        src={image.url ?? ""}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="row-span-2 row-start-1 aspect-square lg:col-start-2">
            <Carousel setApi={setCarouselApi} className="size-full">
              <CarouselContent>
                {product.images.map((image) => (
                  <CarouselItem key={image.id}>
                    <div className="relative aspect-square">
                      <Image
                        src={image.url ?? ""}
                        alt={product.name}
                        fill
                        className="rounded-lg object-cover"
                        priority
                      />
                    </div>
                  </CarouselItem>
                ))}
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
              <div className="flex space-x-1">{product.category?.name}</div>
            </div>
            <div className="space-y-2">
              <h3 className="font-bold">Avaliação</h3>
              <div className="flex space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="text-foreground size-5"
                    fill={i < product.rating ? "currentColor" : "none"}
                  />
                ))}
              </div>
            </div>
            <div className="w-full flex flex-col gap-2">
              <Button
                className=" cursor-pointer rounded-full"
                size="lg"
                onClick={handleAddToCart}
              >
                Adicionar ao carrinho
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
        </div>
      </section>
    </div>
  );
}
