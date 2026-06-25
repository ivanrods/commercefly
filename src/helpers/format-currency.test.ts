import { describe, expect, it } from "vitest";
import { formatCurrency } from "./format-currency";

describe("formatCurrency", () => {
  it("formats integer values", () => {
    expect(formatCurrency(1000)).toBe("R$ 1.000,00");
  });

  it("formats decimal values", () => {
    expect(formatCurrency(1999.9)).toBe("R$ 1.999,90");
  });

  it("formats zero", () => {
    expect(formatCurrency(0)).toBe("R$ 0,00");
  });

  it("formats small values", () => {
    expect(formatCurrency(0.5)).toBe("R$ 0,50");
  });
});
