"use client";

import {
  Trash2,
  Minus,
  Plus,
  ShoppingBag,
  Shield,
  CreditCard,
  Store,
  MoveRight,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "src/components/ui/card";
import { Button } from "src/components/ui/button";

import { Separator } from "src/components/ui/separator";
import {
  useAddCart,
  useCart,
  useDecrementCart,
  useRemoveCart,
} from "src/hooks/use-cart";
import { Product } from "src/types/product-type";
import { CartItem } from "src/types/cart-item-type";
import { formatCurrency } from "src/helpers/format-currency";
import { checkout } from "src/services/checkout-service";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Skeleton } from "src/components/ui/skeleton";

/*
export const metadata = {
  title: "Carrinho de Compras | Commercefly",
  description:
    "Revise seus produtos, ajuste quantidades e finalize sua compra com segurança na Commercefly.",
};
*/

export default function ShoppingCart1() {
  const router = useRouter();

  const { data: cart, isLoading } = useCart();
  const { mutate: addItem } = useAddCart();
  const { mutate: decrementItem } = useDecrementCart();
  const { mutate: removeItem } = useRemoveCart();

  type CartItemType = {
    product: Pick<Product, "id" | "name" | "price"> & {
      images: { url: string }[];
    };
    quantity: number;
  };

  const items: CartItem[] =
    cart?.items.map((item: CartItemType) => ({
      productId: item.product.id,
      name: item.product.name,
      price: item.product.price,
      imageUrl: item.product.images[0]?.url ?? "",
      quantity: item.quantity,
    })) ?? [];

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  const totalPrice = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <Skeleton className="mb-6 h-8 w-64" />
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex gap-4 rounded-lg border p-4">
              <Skeleton className="h-24 w-24 rounded-md" />
              <div className="flex flex-1 flex-col gap-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-24" />
                <div className="mt-auto flex justify-between">
                  <Skeleton className="h-8 w-24" />
                  <Skeleton className="h-6 w-20" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8 space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Seu carrinho de compras
        </h1>
        <p className="text-muted-foreground">
          {totalItems} produtos no seu carrinho •{" "}
          <span className="text-foreground font-semibold">
            {formatCurrency(totalPrice)}
          </span>
        </p>
      </div>
      <div className="flex flex-col gap-8 lg:flex-row">
        <div className="flex-1 space-y-6">
          {items.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <ShoppingBag className="text-muted-foreground/50 mb-4 size-12" />
                <h3 className="text-lg font-medium">Seu carrinho está vazio</h3>
                <p className="text-muted-foreground mt-1 text-sm">
                  Adicione alguns itens para começar.
                </p>
                <Button
                  className="mt-4 cursor-pointer"
                  variant="outline"
                  onClick={() => router.push("/")}
                >
                  Continuar comprando
                </Button>
              </CardContent>
            </Card>
          ) : (
            items.map((item) => (
              <Card key={item.productId}>
                <div className="flex flex-col sm:flex-row">
                  <div className="relative h-auto w-full sm:w-40">
                    <div className="relative h-36 w-full sm:w-40">
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        className="object-cover object-center"
                      />
                    </div>
                  </div>

                  <div className="flex-1 p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-foreground text-lg font-medium">
                          {item.name}
                        </h3>
                        <p className="text-muted-foreground mt-1 text-sm"></p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive size-8 cursor-pointer"
                        onClick={() => removeItem(item.productId)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="size-8 cursor-pointer"
                          onClick={() => decrementItem(item.productId)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="size-3" />
                        </Button>
                        <span className="w-8 text-center text-sm font-medium">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="size-8 cursor-pointer"
                          onClick={() => addItem(item.productId)}
                        >
                          <Plus className="size-3" />
                        </Button>
                      </div>

                      <div className="text-end">
                        <p className="text-lg font-semibold">
                          {formatCurrency(item.price * item.quantity)}
                        </p>
                        {item.price > item.price && (
                          <p className="text-muted-foreground text-xs line-through">
                            {formatCurrency(item.price)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        <div className="w-full space-y-4 lg:w-96">
          <Card className="sticky top-4 gap-0">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl">Resumo do pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatCurrency(totalPrice)}</span>
                </div>
              </div>

              <Separator className="my-2" />

              <div className="flex items-center justify-between text-base font-medium">
                <span>Total</span>
                <div className="text-end">
                  <p className="text-xl font-bold">
                    {formatCurrency(totalPrice)}
                  </p>
                </div>
              </div>

              <Button
                size="lg"
                className="mt-4 w-full cursor-pointer text-base font-medium"
                disabled={items.length === 0}
                onClick={checkout}
              >
                <ShoppingBag className="me-2 size-5" />
                Fazer o Checkout
              </Button>

              <div className="text-muted-foreground flex items-center justify-center gap-2 text-xs">
                <CreditCard className="size-3.5" />
                <span>Pagamento seguro com criptografia SSL</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-dashed py-4">
            <CardContent className="px-4">
              <div className="flex items-start gap-3">
                <div className="flex size-10 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                  <Shield className="size-5" />
                </div>
                <div>
                  <h4 className="font-medium">Finalização de compra segura</h4>
                  <p className="text-muted-foreground mt-1 text-xs">
                    Suas informações de pagamento são criptografadas e seguras.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button
            variant="outline"
            className="w-full cursor-pointer"
            onClick={() => router.push("/")}
          >
            <Store className="me-2 size-4" />
            Continuar comprando
            <MoveRight className="ms-2 size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
