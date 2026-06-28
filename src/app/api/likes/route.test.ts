import { describe, expect, it, vi } from "vitest";
import { GET } from "./route";

vi.mock("@clerk/nextjs/server", () => ({ auth: vi.fn() }));

import { auth } from "@clerk/nextjs/server";

describe("GET /api/likes", () => {
  it("returns 401 when unauthenticated", async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.mocked(auth).mockResolvedValue({ userId: null } as any);
    const res = await GET();
    expect(res.status).toBe(401);
  });
});
