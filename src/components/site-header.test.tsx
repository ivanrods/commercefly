import { render, screen } from "@/tests/test-utils";
import { SiteHeader } from "./site-header";
import { describe, expect, it } from "vitest";

describe("SiteHeader", () => {
  it("renders the store name and navigation links", () => {
    render(<SiteHeader />);
    expect(screen.getByText("CommerceFly")).toBeInTheDocument();
    expect(screen.getByText("Início")).toBeInTheDocument();
    expect(screen.getByText("Produtos")).toBeInTheDocument();
    expect(screen.getByText("Pedidos")).toBeInTheDocument();
    expect(screen.getByText("Carrinho")).toBeInTheDocument();
    expect(screen.getByText("Favoritos")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Pesquisar produtos..."),
    ).toBeInTheDocument();
  });
});
