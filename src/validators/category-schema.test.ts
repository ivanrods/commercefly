import { describe, expect, it } from "vitest";
import { categorySchema } from "./category-schema";

describe("categorySchema", () => {
  it("accepts valid category", () => {
    const result = categorySchema.safeParse({
      name: "Eletrônicos",
      slug: "eletronicos",
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty name", () => {
    const result = categorySchema.safeParse({ name: "", slug: "eletronicos" });
    expect(result.success).toBe(false);
  });

  it("rejects empty slug", () => {
    const result = categorySchema.safeParse({ name: "Eletrônicos", slug: "" });
    expect(result.success).toBe(false);
  });

  it("accepts optional imageUrl", () => {
    const without = categorySchema.safeParse({ name: "N", slug: "n" });
    const withUrl = categorySchema.safeParse({
      name: "N",
      slug: "n",
      imageUrl: "https://example.com/img.jpg",
    });
    const empty = categorySchema.safeParse({
      name: "N",
      slug: "n",
      imageUrl: "",
    });
    expect(without.success).toBe(true);
    expect(withUrl.success).toBe(true);
    expect(empty.success).toBe(true);
  });
});
