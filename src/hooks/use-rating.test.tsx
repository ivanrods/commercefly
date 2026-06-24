import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useProductRating, useSubmitRating } from "./use-rating";
import type { ReactNode } from "react";

vi.mock("@/services/rating-service", () => ({
  getProductRating: vi.fn(),
  submitRating: vi.fn(),
}));

import { getProductRating, submitRating } from "@/services/rating-service";
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

describe("useProductRating", () => {
  it("fetches product rating", async () => {
    vi.mocked(getProductRating).mockResolvedValue({ average: 4.5, count: 10 });
    const { result } = renderHook(() => useProductRating("p1"), { wrapper });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual({ average: 4.5, count: 10 });
  });
});

describe("useSubmitRating", () => {
  it("calls submitRating on mutate", async () => {
    vi.mocked(submitRating).mockResolvedValue({ success: true });
    const { result } = renderHook(() => useSubmitRating(), { wrapper });
    result.current.mutate({ productId: "p1", value: 5 });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(submitRating).toHaveBeenCalledWith("p1", 5);
  });
});
