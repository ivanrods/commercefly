import { describe, expect, it, vi } from "vitest";
import { GET } from "./route";

vi.mock("@/lib/prisma", () => ({
  default: { like: { count: vi.fn() } },
}));

import prisma from "@/lib/prisma";

describe("GET /api/likes/count", () => {
  it("returns 400 when productId is missing", async () => {
    const req = new Request("http://localhost/api/likes/count");
    const res = await GET(req);
    expect(res.status).toBe(400);
  });

  it("returns the like count", async () => {
    vi.mocked(prisma.like.count).mockResolvedValue(5);
    const req = new Request("http://localhost/api/likes/count?productId=p1");
    const res = await GET(req);
    const body = await res.json();
    expect(body).toEqual({ count: 5 });
  });
});
