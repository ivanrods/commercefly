import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Prisma } from "@/app/generated/prisma/client";
import { formatCurrency } from "@/helpers/format-currency";

type OrderWithDetails = Prisma.OrderGetPayload<{
  include: {
    user: true;
    items: {
      include: {
        product: true;
      };
    };
  };
}>;

interface OrderCardProps {
  order: OrderWithDetails;
}

export function OrderCard({ order }: OrderCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Pedido #{order.orderNumber}</CardTitle>
          <p className="text-sm text-muted-foreground">
            Cliente: {order.user.email}
          </p>
        </div>

        <div className="text-right space-y-1">
          <p className="font-semibold">
            {formatCurrency(order.totalAmount / 100)}
          </p>

          <Badge
            variant={
              order.status === "PAID"
                ? "default"
                : order.status === "CANCELED"
                  ? "destructive"
                  : "secondary"
            }
          >
            {order.status}
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          {order.items.map((item, index) => (
            <div key={item.id}>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Quantidade: {item.quantity}
                  </p>
                </div>

                <p className="text-sm">{formatCurrency(item.price / 100)}</p>
              </div>

              {index < order.items.length - 1 && <Separator className="mt-3" />}
            </div>
          ))}
        </div>

        <div className="mt-4 text-xs text-muted-foreground">
          Criado em: {new Date(order.createdAt).toLocaleString("pt-BR")}
        </div>
      </CardContent>
    </Card>
  );
}
