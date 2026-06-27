import { describe, expect, it, vi } from "vitest";
import { GET } from "./route";

vi.mock("@clerk/nextjs/server", () => ({ auth: vi.fn() }));

import { auth } from "@clerk/nextjs/server";

describe("GET /api/likes/check", () => {
  it("returns isLiked false when unauthenticated", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: null } as any);
    const req = new Request("http://localhost/api/likes/check?productId=p1");
    const res = await GET(req);
    const body = await res.json();
    expect(body).toEqual({ isLiked: false });
  });
});
