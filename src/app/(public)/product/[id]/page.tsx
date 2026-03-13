import Image from "next/image";
import { Button } from "src/components/ui/button";
import { Card, CardContent } from "src/components/ui/card";
import { formatCurrency } from "src/helpers/format-currency";
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
    <div className="max-w-7xl mx-auto my-32 ">
      <Card className="border-none shadow-none">
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-muted">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="flex flex-col gap-6">
            <div>
              <h1 className="text-3xl font-bold">{product.name}</h1>
              <p className="text-muted-foreground mt-2">
                {product.description}
              </p>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-3xl font-bold text-primary">
                {formatCurrency(product.price)}
              </p>
            </div>

            <Button size="lg" className="w-full md:w-fit">
              Comprar agora
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
