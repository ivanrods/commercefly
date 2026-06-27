import { describe, expect, it, vi } from "vitest";
import { POST } from "./route";

vi.mock("@/lib/auth", () => ({ requireAdmin: vi.fn() }));

import { requireAdmin } from "@/lib/auth";

describe("POST /api/products", () => {
  it("returns 500 when user is not admin", async () => {
    vi.mocked(requireAdmin).mockRejectedValue(
      new Error("Sem permissão de administrador"),
    );
    const req = new Request("http://localhost/api/products", {
      method: "POST",
      body: JSON.stringify({ name: "Test" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(500);
  });
});
