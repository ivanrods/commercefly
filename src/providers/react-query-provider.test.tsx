import { render, screen } from "@testing-library/react";
import { ReactQueryProvider } from "./react-query-provider";
import { describe, expect, it } from "vitest";

describe("ReactQueryProvider", () => {
  it("renders children", () => {
    render(
      <ReactQueryProvider>
        <div data-testid="child">Hello</div>
      </ReactQueryProvider>,
    );
    expect(screen.getByTestId("child")).toHaveTextContent("Hello");
  });
});
