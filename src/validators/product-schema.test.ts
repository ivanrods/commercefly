import { describe, expect, it } from "vitest";
import { productSchema, productFormSchema } from "./product-schema";

const validProduct = {
  name: "Smartphone XYZ",
  description: "Um smartphone incrível com muitas funcionalidades",
  price: 1999,
  images: ["https://example.com/img.jpg"],
  stock: 10,
  categoryId: "cat-1",
  isFeatured: false,
};

describe("productSchema", () => {
  it("accepts valid product", () => {
    const result = productSchema.safeParse(validProduct);
    expect(result.success).toBe(true);
  });

  it("rejects short name", () => {
    const result = productSchema.safeParse({ ...validProduct, name: "AB" });
    expect(result.success).toBe(false);
  });

  it("rejects short description", () => {
    const result = productSchema.safeParse({
      ...validProduct,
      description: "ABC",
    });
    expect(result.success).toBe(false);
  });

  it("rejects non-positive price", () => {
    const zero = productSchema.safeParse({ ...validProduct, price: 0 });
    const negative = productSchema.safeParse({ ...validProduct, price: -1 });
    expect(zero.success).toBe(false);
    expect(negative.success).toBe(false);
  });

  it("rejects empty images", () => {
    const result = productSchema.safeParse({ ...validProduct, images: [] });
    expect(result.success).toBe(false);
  });

  it("rejects invalid image URL", () => {
    const result = productSchema.safeParse({
      ...validProduct,
      images: ["not-a-url"],
    });
    expect(result.success).toBe(false);
  });

  it("rejects negative stock", () => {
    const result = productSchema.safeParse({ ...validProduct, stock: -1 });
    expect(result.success).toBe(false);
  });

  it("rejects empty categoryId", () => {
    const result = productSchema.safeParse({
      ...validProduct,
      categoryId: "",
    });
    expect(result.success).toBe(false);
  });

  it("defaults isFeatured to false when omitted", () => {
    const { isFeatured, ...withoutFeatured } = validProduct;
    const result = productSchema.safeParse(withoutFeatured);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.isFeatured).toBe(false);
    }
  });
});

describe("productFormSchema", () => {
  it("accepts valid form data", () => {
    const result = productFormSchema.safeParse(validProduct);
    expect(result.success).toBe(true);
  });

  it("rejects empty name", () => {
    const result = productFormSchema.safeParse({
      ...validProduct,
      name: "",
    });
    expect(result.success).toBe(false);
  });
});
