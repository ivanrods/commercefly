"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useCartStore } from "src/store/cart-store";

export function useSyncCart() {
  const { isSignedIn } = useUser();
  const items = useCartStore((state) => state.items);

  useEffect(() => {
    if (!isSignedIn) return;

    if (items.length === 0) return;

    fetch("/api/cart/sync", {
      method: "POST",
      body: JSON.stringify({ items }),
    });
  }, [items, isSignedIn]);
}
