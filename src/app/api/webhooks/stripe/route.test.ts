import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/stripe", () => ({
  stripe: { webhooks: { constructEvent: vi.fn() } },
}));

vi.mock("@/lib/prisma", () => ({
  default: {
    cart: { findUnique: vi.fn() },
    order: { create: vi.fn() },
    cartItem: { deleteMany: vi.fn() },
  },
}));

import { POST } from "./route";

describe("POST /api/webhooks/stripe", () => {
  it("returns 400 when signature is missing", async () => {
    const req = new Request("http://localhost/api/webhooks/stripe", {
      method: "POST",
      body: "test",
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});
