import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "src/components/ui/card";
import {
  List,
  Plus,
  Logs,
  Tags,
  ShoppingCart,
  Users,
  BarChart,
} from "lucide-react";

const items = [
  {
    title: "Lista de produtos",
    url: "/admin/products",
    icon: List,
  },
  {
    title: "Criar produto",
    url: "/admin/products/new",
    icon: Plus,
  },
  {
    title: "Lista de categorias",
    url: "/admin/categories",
    icon: Logs,
  },
  {
    title: "Criar categoria",
    url: "/admin/categories/new",
    icon: Tags,
  },
  {
    title: "Pedidos",
    url: "/admin/orders",
    icon: ShoppingCart,
  },
  {
    title: "Lista de usuários",
    url: "/admin/users",
    icon: Users,
  },
  {
    title: "Análise",
    url: "/admin/products/analytics",
    icon: BarChart,
  },
];

export default function AdminPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Painel Administrativo</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <Link key={item.title} href={item.url}>
              <Card className="hover:shadow-lg transition cursor-pointer">
                <CardHeader className="flex flex-row items-center gap-4">
                  <Icon className="w-6 h-6" />
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Acessar {item.title.toLowerCase()}
                  </p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
