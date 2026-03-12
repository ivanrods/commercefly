"use client";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useCartStore } from "@/src/store/cart-store";
import { ShoppingCart } from "lucide-react";
import CartProductItem from "./cart-product-item";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/src/helpers/format-currency";
export function CartDrawer() {
  const items = useCartStore((state) => state.items);
  const totalPrice = useCartStore((state) => state.totalPrice());
  const totalItems = useCartStore((state) => state.totalItems());
  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>
        <Button variant="outline">
          <ShoppingCart />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Carrinho</DrawerTitle>
          <DrawerDescription>
            Você tem {totalItems} itens no carrinho
          </DrawerDescription>
        </DrawerHeader>
        <div className="no-scrollbar overflow-y-auto px-4">
          {items.map((item) => (
            <CartProductItem key={item.id} product={item} />
          ))}
        </div>
        <DrawerFooter>
          <Card>
            <CardContent>
              <div className="flex justify-between">
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-sm font-semibold">
                  {formatCurrency(totalPrice)}
                </p>
              </div>
            </CardContent>
          </Card>
          <Button>Finalizar pedido</Button>
          <DrawerClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
