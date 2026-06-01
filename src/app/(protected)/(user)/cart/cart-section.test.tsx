import { render, screen } from "@/tests/test-utils";
import CartSection from "./cart-section";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/hooks/use-cart", () => ({
  useCart: () => ({ data: null }),
  useAddCart: () => ({ mutate: vi.fn() }),
  useDecrementCart: () => ({ mutate: vi.fn() }),
  useRemoveCart: () => ({ mutate: vi.fn() }),
}));

vi.mock("@/services/checkout-service", () => ({
  checkout: vi.fn(),
}));

describe("CartSection", () => {
  it("shows empty cart message when no items", () => {
    render(<CartSection initialCart={null} />);
    expect(screen.getByText("Seu carrinho está vazio")).toBeInTheDocument();
  });

  it("shows items when cart has products", () => {
    const cart = {
      items: [
        {
          product: {
            id: "p1",
            name: "Camiseta",
            price: 50,
            images: [{ url: "/img1.jpg" }],
          },
          quantity: 2,
        },
        {
          product: {
            id: "p2",
            name: "Tênis",
            price: 30,
            images: [{ url: "/img2.jpg" }],
          },
          quantity: 1,
        },
      ],
    };
    render(<CartSection initialCart={cart} />);
    expect(screen.getByText("Camiseta")).toBeInTheDocument();
    expect(screen.getByText("Tênis")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Fazer o Checkout/ }),
    ).toBeInTheDocument();
  });
});
