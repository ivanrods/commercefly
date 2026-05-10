import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import LikesProductCard from "./likes-product-card";

export const metadata = {
  title: "Meus Favoritos | Commercefly",
  description:
    "Veja todos os produtos que você marcou como favorito na Commercefly.",
};

export default async function LikesPage() {
  const { userId } = await auth();

  if (!userId) {
    return <div>Não autenticado</div>;
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (!user) return null;

  const likes = await prisma.like.findMany({
    where: { userId: user.id },
    include: {
      product: {
        include: {
          images: true,
          category: true,
          _count: {
            select: { likes: true },
          },
        },
      },
    },
  });

  const products = likes.map((like) => like.product);
  if (products.length === 0) {
    return (
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
    );
  }

  return (
    <section className=" p-4 md:p-0">
      <header className="mx-auto mb-12 ">
        <div className="flex flex-col items-center justify-between gap-6 text-center md:flex-row md:text-start">
          <div className="space-y-4">
            <div className="inline-flex">
              <span className="bg-secondary/80 text-secondary-foreground rounded-full px-4 py-1.5 text-sm font-medium">
                Lista de favoritos
              </span>
            </div>
            <div className="space-y-2">
              <h2 className="text-foreground text-3xl font-bold tracking-tight md:text-4xl">
                Todas as favoritos do usuário
              </h2>
              <p className="text-muted-foreground max-w-2xl">
                Explore nossa coleção exclusiva de produtos. Cada peça é
                escolhida a dedo para quem aprecia qualidade e estilo.
              </p>
            </div>
          </div>
          <Link href="/">
            <Button className="cursor-pointer whitespace-nowrap" size="lg">
              Voltar para a página inicial
              <ArrowRight className="ms-2" />
            </Button>
          </Link>
        </div>
      </header>

      <div className="grid grid-cols-1 mb-8 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:gap-6 xl:grid-cols-6 ">
        {products.map((product) => (
          <div key={product.id} className="relative">
            <LikesProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
}
