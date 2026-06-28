import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/services/product-service", () => ({
  getProducts: vi.fn().mockResolvedValue({ products: [] }),
}));

describe("AdminProductsPage", () => {
  it("renders produtos heading", async () => {
    const Page = await import("./page").then((m) => m.default);
    const { container } = render(await Page());
    expect(screen.getByText("Lista de produtos")).toBeInTheDocument();
  });
});
