import { getProducts } from "src/services/product-service";
import { ProductsTable } from "./products-table";
import Link from "next/link";
import { Button } from "src/components/ui/button";
import { ArrowRight } from "lucide-react";

export default async function Page() {
  const { products } = await getProducts({
    page: 1,
    limit: 1000,
  });
  return (
    <div className="w-full p-4 space-y-4">
      <header className="mx-auto ">
        <div className="flex flex-col items-center justify-between gap-6 text-center md:flex-row md:text-start">
          <div className="space-y-4">
            <div className="inline-flex">
              <span className="bg-secondary/80 text-secondary-foreground rounded-full px-4 py-1.5 text-sm font-medium">
                Lista de produtos
              </span>
            </div>
            <div className="space-y-2">
              <h2 className="text-foreground text-3xl font-bold tracking-tight md:text-4xl">
                Todos os produtos
              </h2>
              <p className="text-muted-foreground max-w-2xl">
                Lista de todos os pordutos para explorar e ver o status deles.
              </p>
            </div>
          </div>
          <Link href="/admin">
            <Button className="cursor-pointer whitespace-nowrap" size="lg">
              Voltar para a página inicial
              <ArrowRight className="ms-2" />
            </Button>
          </Link>
        </div>
      </header>
      <ProductsTable products={products} />
    </div>
  );
}
