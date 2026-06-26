vi.mock("@clerk/nextjs/server", () => {
  const mockAuth = vi.fn().mockResolvedValue({
    sessionClaims: { metadata: { role: "USER" } },
  });
  return {
    clerkMiddleware: vi.fn((cb) => cb),
    createRouteMatcher: vi.fn(() => vi.fn().mockReturnValue(false)),
    auth: mockAuth,
  };
});

vi.mock("next/server", () => ({
  NextResponse: { redirect: vi.fn() },
}));

import { describe, expect, it, vi } from "vitest";
import { config } from "./middleware";

describe("middleware config", () => {
  it("exports a matcher array", () => {
    expect(config).toHaveProperty("matcher");
    expect(Array.isArray(config.matcher)).toBe(true);
    expect(config.matcher.length).toBeGreaterThan(0);
  });
});
