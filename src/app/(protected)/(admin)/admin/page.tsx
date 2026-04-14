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
  ArrowRight,
} from "lucide-react";
import { Button } from "src/components/ui/button";

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
    <div className="w-full p-4 space-y-4">
      <header className="mx-auto ">
        <div className="flex flex-col items-center justify-between gap-6 text-center md:flex-row md:text-start">
          <div className="space-y-4">
            <div className="inline-flex">
              <span className="bg-secondary/80 text-secondary-foreground rounded-full px-4 py-1.5 text-sm font-medium">
                Painel Administrativo
              </span>
            </div>
            <div className="space-y-2">
              <h2 className="text-foreground text-3xl font-bold tracking-tight md:text-4xl">
                Todos os paineis
              </h2>
              <p className="text-muted-foreground max-w-2xl">
                Acesse todos os painéis e veja os detalhes.
              </p>
            </div>
          </div>
          <Link href="/">
            <Button className="cursor-pointer whitespace-nowrap" size="lg">
              Voltar para a página inicial
              <ArrowRight className="ms-2" />
            </Button>
          </Link>
        </div>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 p-2">
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
