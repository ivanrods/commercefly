import { auth } from "@clerk/nextjs/server";
import { ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Badge } from "src/components/ui/badge";
import { Button } from "src/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "src/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "src/components/ui/table";
import { formatCurrency } from "src/helpers/format-currency";
import prisma from "src/lib/prisma";
import { getOrders } from "src/services/orders-service";

export default async function OrdersPage() {
  const { userId: clerkId } = await auth();

  if (!clerkId) {
    redirect("/");
  }

  const user = await prisma.user.findUnique({
    where: { clerkId },
  });

  if (!user) {
    return <div>Usuário não encontrado</div>;
  }

  const orders = await getOrders(user.id);

  return (
    <div className="mx-auto">
      {orders.length === 0 ? (
        <Card className="border-dashed m-8">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <ShoppingBag className="text-muted-foreground/50 mb-4 size-12" />
            <h3 className="text-lg font-medium">Você não tem nenhum pedido</h3>
            <p className="text-muted-foreground mt-1 text-sm">
              Faça sua primeira compra.
            </p>
            <Link href="/">
              <Button className="mt-4 cursor-pointer" variant="outline">
                Continuar comprando
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="p-6">
          <Card className="mx-auto my-6 max-w-(--breakpoint-xl)">
            <CardHeader className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between md:space-y-0 md:gap-x-6">
              <div>
                <CardTitle className="text-2xl">Histórico de pedidos</CardTitle>
                <CardDescription className="text-balance">
                  Veja seus pedidos anteriores e o status deles.
                </CardDescription>
              </div>
              <div className="text-muted-foreground text-end text-sm max-sm:text-start">
                <p>Total de pedidos: {orders.length}</p>
              </div>
            </CardHeader>
            {orders.map((order) => (
              <CardContent key={order.id}>
                <p>Pedido: {order.orderNumber}</p>
                <Badge>{order.status}</Badge>
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="font-semibold">Produto</TableHead>
                      <TableHead className="text-end font-semibold">
                        Data do pedido
                      </TableHead>
                      <TableHead className="text-end font-semibold">
                        Quantidade
                      </TableHead>
                      <TableHead className="text-end font-semibold">
                        Preço
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {order.items.map((item, i) => (
                      <TableRow key={i}>
                        <TableCell className="flex items-center gap-3">
                          <div className="relative w-16 h-16">
                            <Image
                              src={item.product.images[0].url}
                              alt={item.name}
                              fill
                              className="rounded-md object-cover"
                              sizes="64px"
                            />
                          </div>
                          <div>
                            <p className="font-medium">{item.name}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-end">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-end">
                          {item.quantity}
                        </TableCell>
                        <TableCell className="text-end">
                          {formatCurrency(item.price / 100)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  <TableFooter className="bg-transparent">
                    <TableRow className="font-semibold hover:bg-transparent">
                      <TableCell colSpan={3}></TableCell>
                      <TableCell className="text-end">
                        {formatCurrency(order.totalAmount / 100)}
                      </TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
              </CardContent>
            ))}
          </Card>
        </div>
      )}
    </div>
  );
}
