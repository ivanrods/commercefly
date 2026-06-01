import { render, screen } from "@/tests/test-utils";
import { BottomNav } from "./bottom-nav";
import { describe, expect, it } from "vitest";

describe("BottomNav", () => {
  it("renders all 5 navigation links", () => {
    render(<BottomNav />);
    expect(screen.getByText("Início")).toBeInTheDocument();
    expect(screen.getByText("Produtos")).toBeInTheDocument();
    expect(screen.getByText("Pedidos")).toBeInTheDocument();
    expect(screen.getByText("Carrinho")).toBeInTheDocument();
    expect(screen.getByText("Favoritos")).toBeInTheDocument();
  });
});
