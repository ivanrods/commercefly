import { describe, expect, it, vi } from "vitest";
import { GET, POST } from "./route";

vi.mock("@clerk/nextjs/server", () => ({ auth: vi.fn() }));
vi.mock("@/lib/auth", () => ({ requireAdmin: vi.fn() }));
vi.mock("@/lib/prisma", () => ({
  default: {
    category: { findMany: vi.fn(), findUnique: vi.fn(), create: vi.fn() },
  },
}));

import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

describe("GET /api/categories", () => {
  it("returns categories", async () => {
    const mockCategories = [{ id: "1", name: "Cat 1", slug: "cat-1" }];
    vi.mocked(prisma.category.findMany).mockResolvedValue(mockCategories);

    const res = await GET();
    const body = await res.json();

    expect(body).toEqual(mockCategories);
  });
});

describe("POST /api/categories", () => {
  it("returns 500 when user is not admin", async () => {
    vi.mocked(requireAdmin).mockRejectedValue(
      new Error("Sem permissão de administrador"),
    );
    const req = new Request("http://localhost/api/categories", {
      method: "POST",
      body: JSON.stringify({ name: "Test", slug: "test" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(500);
  });
});
