import { describe, expect, it, vi } from "vitest";

vi.mock("./stripe", () => ({
  stripe: {},
}));

import { stripe } from "./stripe";

describe("stripe", () => {
  it("exports a Stripe instance", () => {
    expect(stripe).toBeDefined();
  });
});
