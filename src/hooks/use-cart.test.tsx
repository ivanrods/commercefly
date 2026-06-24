import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  useCart,
  useAddCart,
  useDecrementCart,
  useRemoveCart,
} from "./use-cart";
import type { ReactNode } from "react";

vi.mock("@/services/cart-service", () => ({
  getCart: vi.fn(),
  addToCart: vi.fn(),
  decrementCartItem: vi.fn(),
  removeFromCart: vi.fn(),
}));

import {
  getCart,
  addToCart,
  decrementCartItem,
  removeFromCart,
} from "@/services/cart-service";
import { describe, expect, it, vi } from "vitest";

function wrapper({ children }: { children: ReactNode }) {
  const qc = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
      mutations: { retry: false },
    },
  });
  return <QueryClientProvider client={qc}>{children}</QueryClientProvider>;
}

describe("useCart", () => {
  it("fetches cart data", async () => {
    vi.mocked(getCart).mockResolvedValue({ items: [] });
    const { result } = renderHook(() => useCart(), { wrapper });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual({ items: [] });
  });
});

describe("useAddCart", () => {
  it("calls addToCart on mutate", async () => {
    vi.mocked(addToCart).mockResolvedValue(undefined);
    const { result } = renderHook(() => useAddCart(), { wrapper });
    result.current.mutate("prod-1");
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(addToCart).toHaveBeenCalledWith("prod-1", expect.anything());
  });
});

describe("useDecrementCart", () => {
  it("calls decrementCartItem on mutate", async () => {
    vi.mocked(decrementCartItem).mockResolvedValue(undefined);
    const { result } = renderHook(() => useDecrementCart(), { wrapper });
    result.current.mutate("prod-1");
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(decrementCartItem).toHaveBeenCalledWith("prod-1", expect.anything());
  });
});

describe("useRemoveCart", () => {
  it("calls removeFromCart on mutate", async () => {
    vi.mocked(removeFromCart).mockResolvedValue(undefined);
    const { result } = renderHook(() => useRemoveCart(), { wrapper });
    result.current.mutate("prod-1");
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(removeFromCart).toHaveBeenCalledWith("prod-1", expect.anything());
  });
});
