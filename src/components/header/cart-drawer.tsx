"use client";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";

import { ShoppingCart } from "lucide-react";
import CartProductItem from "./cart-product-item";
import { Button } from "../ui/button";

import { Card, CardContent } from "../ui/card";
import { formatCurrency } from "src/helpers/format-currency";
import { getCart } from "src/services/cart-service";
import { useEffect, useState } from "react";

export function CartDrawer() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    async function loadCart() {
      const cart = await getCart();

      if (cart?.items) {
        setItems(cart.items);
      }
    }

    loadCart();
  }, []);

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  const totalPrice = items.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0,
  );

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
            <CartProductItem
              key={item.productId}
              product={{
                productId: item.product.id,
                name: item.product.name,
                price: item.product.price,
                imageUrl: item.product.imageUrl,
                quantity: item.quantity,
              }}
            />
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
