import { describe, it, expect, beforeEach } from "vitest";
import { GET } from "../app/api/products/route";
import { Product } from "src/types/product-type";
import prisma from "../lib/prisma";

beforeEach(async () => {
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  const category = await prisma.category.create({
    data: {
      name: "Calçados",
      slug: "calcados",
    },
  });

  await prisma.product.create({
    data: {
      name: "Tênis Nike",
      description: "Tênis esportivo",
      price: 199.9,
      imageUrl: "img.jpg",
      stock: 10,
      isFeatured: true,
      categoryId: category.id,
    },
  });
});

describe("GET /api/products", () => {
  it("should return products with pagination", async () => {
    const request = new Request("http://localhost/api/products?page=1&limit=5");

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);

    expect(data).toHaveProperty("data");
    expect(data).toHaveProperty("meta");

    expect(Array.isArray(data.data)).toBe(true);
    expect(data.meta.page).toBe(1);
    expect(data.meta.limit).toBe(5);
  });

  it("should filter products by category", async () => {
    const request = new Request(
      "http://localhost/api/products?category=calcados",
    );

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);

    data.data.forEach((product: Product) => {
      expect(product.category?.slug).toBe("calcados");
    });
  });

  it("should filter products by search", async () => {
    const request = new Request("http://localhost/api/products?search=tenis");

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);

    data.data.forEach((product: Product) => {
      expect(
        product.name.toLowerCase().includes("tenis") ||
          product.description.toLowerCase().includes("tenis"),
      ).toBe(true);
    });
  });

  it("should return only featured products", async () => {
    const request = new Request("http://localhost/api/products?featured=true");

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);

    data.data.forEach((product: Product) => {
      expect(product.isFeatured).toBe(true);
    });
  });

  it("should return correct pagination metadata", async () => {
    const request = new Request("http://localhost/api/products?page=1&limit=2");

    const response = await GET(request);
    const data = await response.json();

    expect(data.meta).toHaveProperty("total");
    expect(data.meta).toHaveProperty("totalPages");
  });
});
