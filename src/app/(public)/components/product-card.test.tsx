import { render, screen } from "@/tests/test-utils";
import userEvent from "@testing-library/user-event";
import { ProductCard } from "./product-card";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mockMutate = vi.fn();

vi.mock("@/hooks/use-cart", () => ({
  useAddCart: () => ({ mutate: mockMutate }),
}));

const mockProduct = {
  id: "prod-1",
  name: "Camiseta Teste",
  description: "Uma camiseta legal",
  categoryId: "cat-1",
  price: 89.9,
  stock: 10,
  rating: 4.5,
  isFeatured: false,
  images: [{ id: "img-1", url: "/test.jpg" }],
  createdAt: new Date(),
  stripePriceId: null,
  stripeProductId: null,
};

describe("ProductCard", () => {
  beforeEach(() => {
    mockMutate.mockClear();
  });

  it("renders product name, price and add to cart button", () => {
    render(<ProductCard product={mockProduct} id="prod-1" />);
    expect(screen.getByText("Camiseta Teste")).toBeInTheDocument();
    expect(screen.getByText("R$ 89,90")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Adicionar ao carrinho" }),
    ).toBeInTheDocument();
  });

  it("calls addToCart on button click", async () => {
    const user = userEvent.setup();
    render(<ProductCard product={mockProduct} id="prod-1" />);
    await user.click(screen.getByText("Adicionar ao carrinho"));
    expect(mockMutate).toHaveBeenCalledWith("prod-1");
  });
});
