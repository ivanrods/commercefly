import { describe, expect, it, vi } from "vitest";
import { GET, PATCH, DELETE } from "./route";

vi.mock("@clerk/nextjs/server", () => ({ auth: vi.fn() }));
vi.mock("@/lib/auth", () => ({ requireAdmin: vi.fn() }));
vi.mock("@/lib/prisma", () => ({
  default: {
    category: {
      findUnique: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

describe("GET /api/categories/[slug]", () => {
  it("returns a category by slug", async () => {
    const mockCategory = {
      id: "1",
      name: "Cat 1",
      slug: "cat-1",
      products: [],
    };
    vi.mocked(prisma.category.findUnique).mockResolvedValue(mockCategory);

    const req = new Request("http://localhost/api/categories/cat-1");
    const res = await GET(req, {
      params: Promise.resolve({ slug: "cat-1" }),
    });
    const body = await res.json();

    expect(body).toEqual(mockCategory);
  });
});

describe("PATCH /api/categories/[slug]", () => {
  it("returns 500 when user is not admin", async () => {
    vi.mocked(requireAdmin).mockRejectedValue(
      new Error("Sem permissão de administrador"),
    );
    const req = new Request("http://localhost/api/categories/cat-1", {
      method: "PATCH",
      body: JSON.stringify({ name: "Updated" }),
    });
    const res = await PATCH(req, {
      params: Promise.resolve({ slug: "cat-1" }),
    });
    expect(res.status).toBe(500);
  });
});

describe("DELETE /api/categories/[slug]", () => {
  it("returns 500 when user is not admin", async () => {
    vi.mocked(requireAdmin).mockRejectedValue(
      new Error("Sem permissão de administrador"),
    );
    const req = new Request("http://localhost/api/categories/cat-1", {
      method: "DELETE",
    });
    const res = await DELETE(req, {
      params: Promise.resolve({ slug: "cat-1" }),
    });
    expect(res.status).toBe(500);
  });
});
