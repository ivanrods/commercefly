import { describe, expect, it, vi } from "vitest";
import { POST } from "./route";

vi.mock("@clerk/nextjs/server", () => ({ auth: vi.fn() }));

import { auth } from "@clerk/nextjs/server";

describe("POST /api/checkout", () => {
  it("returns 401 when unauthenticated", async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.mocked(auth).mockResolvedValue({ userId: null } as any);
    const res = await POST();
    expect(res.status).toBe(401);
  });
});
