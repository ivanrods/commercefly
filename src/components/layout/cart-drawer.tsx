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
import { ShoppingCart } from "lucide-react";
export function CartDrawer() {
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
          <DrawerDescription>Seus pedidos</DrawerDescription>
        </DrawerHeader>
        <div className="no-scrollbar overflow-y-auto px-4"></div>
        <DrawerFooter>
          <Button>Finalizar pedido</Button>
          <DrawerClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
