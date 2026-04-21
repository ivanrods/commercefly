import {
  Plus,
  List,
  BarChart,
  Users,
  ShoppingCart,
  Tags,
  Logs,
} from "lucide-react";
import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const data = [
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

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar className="relative " collapsible="icon" {...props}>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent className="flex flex-col gap-2">
            <SidebarMenu>
              {data.map((item) => {
                const Icon = item.icon;

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild tooltip={item.title}>
                      <Link href={item.url} className="flex items-center gap-2">
                        <Icon className="size-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
