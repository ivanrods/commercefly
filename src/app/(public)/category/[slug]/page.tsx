import { getCategoryBySlug } from "@/services/category-service";
import { ProductCard } from "../../components/product-card";
import { Button } from "@/components/ui/button";
import { ArrowRight, MoveRight, Store } from "lucide-react";
import Link from "next/link";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    return {
      title: "Categoria não encontrada | Commercefly",
      description:
        "A categoria que você está procurando não existe ou foi removida.",
    };
  }

  return {
    title: `${category.name} | Commercefly`,
    description: `As melhores produtos em ${category.name} para você!`,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;

  const category = await getCategoryBySlug(slug);

  if (!category) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4 ">
        <div className="flex max-w-md flex-col items-center gap-4 text-center">
          <div className="bg-muted flex size-16 items-center justify-center rounded-full">
            <Store className="size-8 text-muted-foreground" />
          </div>

          <h2 className="text-2xl font-bold">Categoria não encontrada</h2>
          <p className="text-muted-foreground">
            A categoria que você está procurando não existe ou foi removida.
          </p>

          <Link href="/category">
            <Button className="mt-2">
              Voltar para a loja
              <MoveRight className="ml-2 size-4" />
            </Button>
          </Link>
        </div>
      </div>
    );
  }
  if (category.products.length === 0) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4 ">
        <div className="flex max-w-md flex-col items-center gap-4 text-center">
          <div className="bg-muted flex size-16 items-center justify-center rounded-full">
            <Store className="size-8 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-bold">Nenhum produto encontrado</h2>
          <p className="text-muted-foreground">
            Nenhum produto encontrado para a categoria {category.name}.
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
    <section className=" p-4 md:p-0">
      <header className="mx-auto mb-12 ">
        <div className="flex flex-col items-center justify-between gap-6 text-center md:flex-row md:text-start">
          <div className="space-y-4">
            <div className="inline-flex">
              <span className="bg-secondary/80 text-secondary-foreground rounded-full px-4 py-1.5 text-sm font-medium">
                Produtos da categoria
              </span>
            </div>
            <div className="space-y-2">
              <h2 className="text-foreground text-3xl font-bold tracking-tight md:text-4xl">
                {category.name}
              </h2>
              <p className="text-muted-foreground max-w-2xl">
                As melhores produtos em {category.name} para você!
              </p>
            </div>
          </div>
          <Link href="/">
            {" "}
            <Button className="cursor-pointer whitespace-nowrap" size="lg">
              Voltar para a página inicial
              <ArrowRight className="ms-2" />
            </Button>
          </Link>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 lg:gap-6">
        {category.products.map((product) => {
          return (
            <ProductCard key={product.id} product={product} id={product.id} />
          );
        })}
      </div>
    </section>
  );
}
