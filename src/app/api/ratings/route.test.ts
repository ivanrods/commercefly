import { describe, expect, it, vi } from "vitest";
import { GET, POST } from "./route";

vi.mock("@clerk/nextjs/server", () => ({ auth: vi.fn() }));
vi.mock("@/lib/prisma", () => ({
  default: {
    rating: { aggregate: vi.fn(), findFirst: vi.fn(), upsert: vi.fn() },
    user: { findUnique: vi.fn() },
    orderItem: { findFirst: vi.fn() },
    product: { update: vi.fn() },
  },
}));

import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

describe("GET /api/ratings", () => {
  it("returns ratings when productId is provided", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: null } as any);
    vi.mocked(prisma.rating.aggregate).mockResolvedValue({
      _avg: { value: 4.5 },
      _count: { value: 10 },
    } as any);

    const req = new Request("http://localhost/api/ratings?productId=p1");
    const res = await GET(req);
    const body = await res.json();

    expect(body).toEqual({
      averageRating: 4.5,
      ratingCount: 10,
      userRating: null,
    });
  });
});

describe("POST /api/ratings", () => {
  it("returns 401 when unauthenticated", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: null } as any);
    const req = new Request("http://localhost/api/ratings", {
      method: "POST",
      body: JSON.stringify({ productId: "p1", value: 5 }),
    });
    const res = await POST(req);
    expect(res.status).toBe(401);
  });
});
