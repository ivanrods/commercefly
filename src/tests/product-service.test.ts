import { describe, it, expect, afterAll, beforeAll } from "vitest";
import prisma from "../lib/prisma";
import {
  getProducts,
  getProductById,
  getFeaturedProducts,
  getProductsByCategory,
  searchProducts,
} from "../services/product-service";

describe("product-service (leituras públicas)", () => {
  let featuredProductId: string;

  beforeAll(async () => {
    const first = await prisma.product.findFirst({
      orderBy: { createdAt: "asc" },
    });
    if (!first) throw new Error("Seed deve criar pelo menos um produto");
    await prisma.product.update({
      where: { id: first.id },
      data: { isFeatured: true },
    });
    featuredProductId = first.id;
  });

  afterAll(async () => {
    if (featuredProductId) {
      await prisma.product.updateMany({
        where: { id: featuredProductId },
        data: { isFeatured: false },
      });
    }
    await prisma.$disconnect();
  });

  it("getProducts retorna lista paginada e total coerentes", async () => {
    const totalInDb = await prisma.product.count();
    const { products, total, page, totalPages } = await getProducts({
      page: 1,
      limit: 8,
    });

    expect(total).toBe(totalInDb);
    expect(page).toBe(1);
    expect(products.length).toBeLessThanOrEqual(8);
    expect(totalPages).toBe(Math.ceil(totalInDb / 8));
    expect(products[0]).toMatchObject({
      category: expect.any(Object),
      images: expect.any(Array),
    });
  });

  it("getProducts com limit 0 retorna todos os produtos numa página", async () => {
    const totalInDb = await prisma.product.count();
    const result = await getProducts({ page: 3, limit: 0 });

    expect(result.products.length).toBe(totalInDb);
    expect(result.page).toBe(1);
    expect(result.totalPages).toBe(1);
    expect(result.total).toBe(totalInDb);
  });

  it("getProducts filtra por categoria (slug)", async () => {
    const { products, total } = await getProducts({
      category: "calcados",
      limit: 50,
    });

    expect(total).toBe(2);
    expect(products).toHaveLength(2);
    expect(products.every((p) => p.category.slug === "calcados")).toBe(true);
  });

  it("getProducts filtra apenas destaques", async () => {
    const { products, total } = await getProducts({
      featured: true,
      limit: 50,
    });

    expect(total).toBeGreaterThanOrEqual(1);
    expect(products.every((p) => p.isFeatured)).toBe(true);
    expect(products.some((p) => p.id === featuredProductId)).toBe(true);
  });

  it("getProductById retorna produto com category e images", async () => {
    const product = await getProductById(featuredProductId);

    expect(product).not.toBeNull();
    expect(product!.id).toBe(featuredProductId);
    expect(product!.category).toBeDefined();
    expect(product!.images.length).toBeGreaterThan(0);
  });

  it("getProductById retorna null para id inexistente", async () => {
    const product = await getProductById(
      "00000000-0000-0000-0000-000000000000",
    );
    expect(product).toBeNull();
  });

  it("getFeaturedProducts retorna até 4 destaques com includes", async () => {
    const featured = await getFeaturedProducts();

    expect(featured.length).toBeGreaterThanOrEqual(1);
    expect(featured.length).toBeLessThanOrEqual(4);
    expect(featured.every((p) => p.isFeatured)).toBe(true);
    expect(featured[0].category).toBeDefined();
    expect(Array.isArray(featured[0].images)).toBe(true);
  });

  it("getProductsByCategory retorna produtos ordenados por createdAt desc", async () => {
    const list = await getProductsByCategory("informatica");

    expect(list.length).toBe(2);
    expect(list.every((p) => p.category.slug === "informatica")).toBe(true);
    for (let i = 0; i < list.length - 1; i++) {
      expect(list[i].createdAt >= list[i + 1].createdAt).toBe(true);
    }
  });

  it("searchProducts encontra por nome e pagina", async () => {
    const { products, total, page, totalPages } = await searchProducts({
      query: "Nike",
      page: 1,
      limit: 12,
    });

    expect(total).toBeGreaterThanOrEqual(1);
    expect(page).toBe(1);
    expect(products.some((p) => p.name.includes("Nike"))).toBe(true);
    expect(totalPages).toBe(Math.ceil(total / 12));
  });

  it("searchProducts sem query retorna todos com paginação", async () => {
    const totalInDb = await prisma.product.count();
    const result = await searchProducts({ page: 1, limit: 10 });

    expect(result.total).toBe(totalInDb);
    expect(result.products.length).toBe(Math.min(10, totalInDb));
  });
});
