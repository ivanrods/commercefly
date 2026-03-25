import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Badge } from "src/components/ui/badge";
import { Card } from "src/components/ui/card";
import prisma from "src/lib/prisma";

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

  const orders = await prisma.order.findMany({
    where: {
      userId: user.id,
    },
    include: {
      items: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Meus pedidos</h1>

      {orders.length === 0 ? (
        <p>Você ainda não fez nenhum pedido.</p>
      ) : (
        <Card className="p-4">
          {orders.map((order) => (
            <div key={order.id}>
              <div className="flex justify-between mb-4">
                <div>
                  <p className="font-semibold">Pedido #{order.orderNumber}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-bold">
                    R$ {(order.totalAmount / 100).toFixed(2)}
                  </p>

                  <Badge>{order.status}</Badge>
                </div>
              </div>

              <div className="space-y-2">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between text-sm border-t pt-2"
                  >
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-gray-500">
                        Quantidade: {item.quantity}
                      </p>
                    </div>

                    <p className="font-medium">
                      R$ {(item.price / 100).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}
