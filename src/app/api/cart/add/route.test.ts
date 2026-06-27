import { describe, expect, it, vi } from "vitest";
import { POST } from "./route";

vi.mock("@clerk/nextjs/server", () => ({ auth: vi.fn() }));

import { auth } from "@clerk/nextjs/server";

describe("POST /api/cart/add", () => {
  it("returns 401 when unauthenticated", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: null } as any);
    const req = new Request("http://localhost/api/cart/add", {
      method: "POST",
      body: JSON.stringify({ productId: "p1" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(401);
  });
});
