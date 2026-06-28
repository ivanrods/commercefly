import { describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { POST } from "./route";

vi.mock("@clerk/nextjs/webhooks", () => ({ verifyWebhook: vi.fn() }));

import { verifyWebhook } from "@clerk/nextjs/webhooks";

describe("POST /api/webhooks/clerk", () => {
  it("handles webhook verification error", async () => {
    vi.mocked(verifyWebhook).mockRejectedValue(new Error("Invalid signature"));
    const req = new NextRequest("http://localhost/api/webhooks/clerk", {
      method: "POST",
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});
