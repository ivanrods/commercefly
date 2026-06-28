import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import AdminPage from "./page";

describe("AdminPage", () => {
  it("renders painel administrativo heading", () => {
    render(<AdminPage />);
    expect(screen.getByText("Painel Administrativo")).toBeInTheDocument();
  });
});
