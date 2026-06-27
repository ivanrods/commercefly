import { describe, expect, it, vi } from "vitest";
import { PUT, DELETE } from "./route";

vi.mock("@/lib/auth", () => ({ requireAdmin: vi.fn() }));

import { requireAdmin } from "@/lib/auth";

describe("PUT /api/products/[id]", () => {
  it("returns 500 when user is not admin", async () => {
    vi.mocked(requireAdmin).mockRejectedValue(
      new Error("Sem permissão de administrador"),
    );
    const req = new Request("http://localhost/api/products/p1", {
      method: "PUT",
      body: JSON.stringify({ name: "Updated" }),
    });
    const res = await PUT(req, {
      params: Promise.resolve({ id: "p1" }),
    });
    expect(res.status).toBe(500);
  });
});

describe("DELETE /api/products/[id]", () => {
  it("returns 500 when user is not admin", async () => {
    vi.mocked(requireAdmin).mockRejectedValue(
      new Error("Sem permissão de administrador"),
    );
    const req = new Request("http://localhost/api/products/p1", {
      method: "DELETE",
    });
    const res = await DELETE(req, {
      params: Promise.resolve({ id: "p1" }),
    });
    expect(res.status).toBe(500);
  });
});
