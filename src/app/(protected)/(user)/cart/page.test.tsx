import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@clerk/nextjs/server", () => ({ auth: vi.fn() }));
vi.mock("@/lib/prisma", () => ({
  default: {
    user: { findUnique: vi.fn() },
    cart: { findUnique: vi.fn() },
  },
}));

describe("CartPage", () => {
  it("renders não autenticado when not logged in", async () => {
    const { auth } = await import("@clerk/nextjs/server");
    vi.mocked(auth).mockResolvedValue({ userId: null } as any);

    const Page = await import("./page").then((m) => m.default);
    const { container } = render(await Page());
    expect(screen.getByText("Não autenticado")).toBeInTheDocument();
  });
});
