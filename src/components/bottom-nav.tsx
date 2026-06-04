"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  ShoppingCart,
  ShoppingBasket,
  ShoppingBag,
  Heart,
} from "lucide-react";

export function BottomNav() {
  const pathname = usePathname();

  const items = [
    { href: "/", icon: Home, label: "Início" },
    { href: "/product", icon: ShoppingBag, label: "Produtos" },
    { href: "/orders", icon: ShoppingBasket, label: "Pedidos" },
    { href: "/cart", icon: ShoppingCart, label: "Carrinho" },
    { href: "/likes", icon: Heart, label: "Favoritos" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background md:hidden pb-safe">
      <div className="flex items-center justify-around h-16">
        {items.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center text-xs ${
                isActive ? "text-primary " : "text-muted-foreground"
              }`}
            >
              <Icon
                className={`w-5 h-5 mb-1 ${isActive ? "text-primary" : "text-muted-foreground"}`}
              />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
