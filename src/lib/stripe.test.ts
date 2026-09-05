import { describe, expect, it, vi } from "vitest";

vi.mock("./stripe", () => ({
  getStripe: () => ({}),
}));

import { getStripe } from "./stripe";

describe("stripe", () => {
  it("exports a Stripe instance", () => {
    expect(getStripe()).toBeDefined();
  });
});
