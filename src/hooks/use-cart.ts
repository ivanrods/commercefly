"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useCartStore } from "src/store/cart-store";

export function useSyncCart() {
  const { user } = useUser();
  const items = useCartStore((state) => state.items);

  useEffect(() => {
    if (!user) return;

    fetch("/api/cart/sync", {
      method: "POST",
      body: JSON.stringify({ items }),
    });
  }, [user, items]);
}
