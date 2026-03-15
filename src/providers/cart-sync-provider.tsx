"use client";

import { useSyncCart } from "src/hooks/use-cart";

export function CartSyncProvider() {
  useSyncCart();
  return null;
}
