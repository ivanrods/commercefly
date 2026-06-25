import { stripe } from "./stripe";
import Stripe from "stripe";
import { describe, expect, it } from "vitest";

describe("stripe", () => {
  it("exports a Stripe instance", () => {
    expect(stripe).toBeInstanceOf(Stripe);
  });
});
