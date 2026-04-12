import prisma from "src/lib/prisma";
import { OrderCard } from "./order-card";

export default async function OrdersPage() {
  const orders = await prisma.order.findMany({
    include: {
      user: true,
      items: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Todos os Pedidos</h1>

      <div className="space-y-6">
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}

        {orders.length === 0 && (
          <p className="text-muted-foreground">Nenhum pedido encontrado.</p>
        )}
      </div>
    </div>
  );
}
