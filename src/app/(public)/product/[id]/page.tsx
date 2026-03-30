"use client";
import { useParams } from "next/navigation";
import { MoveRight, Store } from "lucide-react";
import Image from "next/image";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Badge } from "src/components/ui/badge";
import { Button } from "src/components/ui/button";

import { Heart, Star } from "lucide-react";
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

export default function ProductPage() {
  const params = useParams();
  const id = params.id as string;
  const { mutate: addItem } = useAddCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  const [selectedImage, setSelectedImage] = useState(0);
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();

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

  if (loading) return <p>Carregando...</p>;
  if (!product) return <p>Produto não encontrado</p>;

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
              <div className="flex flex-wrap gap-4">
                {product.images.map((image, index) => (
                  <div
                    key={image.id}
                    onMouseEnter={() => setSelectedImage(index)}
                    className={cn(
                      "ring-offset-background size-16 cursor-pointer overflow-hidden rounded-sm ring-offset-2 transition-all lg:size-18",
                      selectedImage === index && "ring-foreground ring-2",
                    )}
                  >
                    <img
                      src={image.url ?? ""}
                      alt={product.name}
                      className="size-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="row-span-2 row-start-1 aspect-square lg:col-start-2">
            <Carousel setApi={setCarouselApi} className="size-full">
              <CarouselContent>
                {product.images.map((image) => (
                  <CarouselItem key={image.id}>
                    <img
                      src={image.url ?? ""}
                      alt={product.name}
                      className="size-full rounded-lg object-cover"
                    />
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
                onClick={() => {
                  addItem(product.id);
                }}
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
