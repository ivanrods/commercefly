import { Button } from "@base-ui/react";
import { Link, MoveRight, Store } from "lucide-react";

import UpdateCategoryForm from "./update-categories-form";
import { getCategoryBySlug } from "@/services/category-service";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};
export default async function EditCategoryPage({ params }: Props) {
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

          <Link href="/admin/categories">
            <Button className="mt-2">
              Voltar para a loja
              <MoveRight className="ml-2 size-4" />
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return <UpdateCategoryForm slug={slug} categories={[category]} />;
}
