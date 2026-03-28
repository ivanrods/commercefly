import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";

import { ShoppingBag, ShoppingCart } from "lucide-react";

import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 py-2 lg:gap-2 lg:px-6">
        <ShoppingBag />
        <h1 className="text-base font-medium">CommerceFly</h1>
        <div className="ml-auto flex items-center gap-2">
          <Link href="/cart">
            <Button variant="ghost">
              <ShoppingCart />
            </Button>
          </Link>

          <Separator
            orientation="vertical"
            className="mx-2 data-[orientation=vertical]:h-4"
          />
          <SignedOut>
            <Button asChild>
              <SignInButton />
            </Button>

            <Button
              variant="outline"
              asChild
              size="sm"
              className="hidden sm:flex"
            >
              <SignUpButton />
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
