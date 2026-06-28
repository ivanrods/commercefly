import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/services/category-service", () => ({
  getCategories: vi.fn(),
}));
vi.mock("@/services/product-service", () => ({
  getProducts: vi.fn(),
}));

describe("HomePage", () => {
  it("renders listas headings", async () => {
    const { getCategories } = await import("@/services/category-service");
    const { getProducts } = await import("@/services/product-service");

    vi.mocked(getCategories).mockResolvedValue({ categories: [] });
    vi.mocked(getProducts).mockResolvedValue({ products: [] });

    const Page = await import("./page").then((m) => m.default);
    render(await Page());
    expect(screen.getByText("Lista popular")).toBeInTheDocument();
    expect(screen.getByText("Podutos recentes")).toBeInTheDocument();
  });
});
