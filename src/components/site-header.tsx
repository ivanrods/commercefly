"use client";

import {
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";

import { ShoppingBag } from "lucide-react";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Input } from "./ui/input";
import { useState } from "react";

export function SiteHeader() {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");

  const getVariant = (path: string) => {
    return pathname === path ? "outline" : "ghost";
  };

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b justify-center">
      <div className="flex w-full max-w-screen-2xl items-center justify-between gap-1 p-3 ">
        <Link href="/" className="flex gap-1">
          <ShoppingBag />
          <h1 className="text-base font-medium">CommerceFly</h1>
        </Link>

        <div className="hidden md:block space-x-4">
          <Link href="/">
            <Button variant={getVariant("/")}>Início</Button>
          </Link>

          <Link href="/product">
            <Button variant={getVariant("/product")}>Produtos</Button>
          </Link>

          <Link href="/orders">
            <Button variant={getVariant("/orders")}>Pedidos</Button>
          </Link>

          <Link href="/cart">
            <Button variant={getVariant("/cart")}>Carrinho</Button>
          </Link>
          <Link href="/likes">
            <Button variant={getVariant("/likes")}>Favoritos</Button>
          </Link>
        </div>

        <div className="flex gap-2 items-center">
          <Input
            className="hidden md:flex"
            type="search"
            placeholder="Pesquisar produtos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                window.location.href = `/search?q=${searchQuery}`;
              }
            }}
            aria-label="Search products"
          />

          <Separator
            orientation="vertical"
            className="mx-2 data-[orientation=vertical]:h-4"
          />

          <SignedOut>
            <Button asChild size="sm">
              <Link href="/sign-in">Entrar</Link>
            </Button>

            <Button
              variant="outline"
              asChild
              size="sm"
              className="hidden sm:flex"
            >
              <Link href="/sign-up">Cadastrar</Link>
            </Button>
          </SignedOut>

          <Button variant="ghost" asChild size="sm" className="hidden sm:flex">
            <SignedIn>
              <UserButton />
            </SignedIn>
          </Button>
        </div>
      </div>
    </header>
  );
}
