import { getProductById } from "@/services/product-service";
import { Button } from "@base-ui/react";
import { Link, MoveRight, Store } from "lucide-react";
import UpdateProductForm from "./update-product-form";
import { getCategories } from "@/services/category-service";

type Props = {
  params: Promise<{
    id: string;
  }>;
};
export default async function EditProductPage({ params }: Props) {
  const { id } = await params;

  const product = await getProductById(id);
  const { categories } = await getCategories({
    page: 1,
    limit: 20,
  });

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

          <Link href="/admin/products">
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
    <UpdateProductForm id={id} product={product} categories={categories} />
  );
}
