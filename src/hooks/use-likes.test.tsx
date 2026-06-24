import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  useLikes,
  useAddLike,
  useRemoveLike,
  useIsLiked,
  useLikeCount,
} from "./use-likes";
import type { ReactNode } from "react";

vi.mock("@/services/like-service", () => ({
  getLikes: vi.fn(),
  addLike: vi.fn(),
  removeLike: vi.fn(),
  isProductLiked: vi.fn(),
  getProductLikeCount: vi.fn(),
}));

import {
  getLikes,
  addLike,
  removeLike,
  isProductLiked,
  getProductLikeCount,
} from "@/services/like-service";
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

describe("useLikes", () => {
  it("fetches likes on mount", async () => {
    vi.mocked(getLikes).mockResolvedValue([{ productId: "p1" }]);
    const { result } = renderHook(() => useLikes(), { wrapper });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual([{ productId: "p1" }]);
  });
});

describe("useAddLike", () => {
  it("calls addLike on mutate", async () => {
    vi.mocked(addLike).mockResolvedValue({ success: true });
    const { result } = renderHook(() => useAddLike(), { wrapper });
    result.current.mutate("p1");
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(addLike).toHaveBeenCalledWith("p1", expect.anything());
  });
});

describe("useRemoveLike", () => {
  it("calls removeLike on mutate", async () => {
    vi.mocked(removeLike).mockResolvedValue({ success: true });
    const { result } = renderHook(() => useRemoveLike(), { wrapper });
    result.current.mutate("p1");
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(removeLike).toHaveBeenCalledWith("p1", expect.anything());
  });
});

describe("useIsLiked", () => {
  it("fetches like status for a product", async () => {
    vi.mocked(isProductLiked).mockResolvedValue({ liked: true });
    const { result } = renderHook(() => useIsLiked("p1"), { wrapper });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual({ liked: true });
  });
});

describe("useLikeCount", () => {
  it("fetches like count for a product", async () => {
    vi.mocked(getProductLikeCount).mockResolvedValue({ count: 5 });
    const { result } = renderHook(() => useLikeCount("p1"), { wrapper });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual({ count: 5 });
  });
});
