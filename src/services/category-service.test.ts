import { describe, it, expect, afterAll } from "vitest";
import prisma from "../lib/prisma";
import {
  getCategories,
  getCategoryBySlug,
  getCategoryById,
} from "../services/category-service";

describe("category-service (leituras públicas)", () => {
  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("getCategories retorna lista paginada, total e totalPages coerentes", async () => {
    const totalInDb = await prisma.category.count();
    const { categories, total, page, totalPages } = await getCategories({
      page: 1,
      limit: 8,
    });

    expect(total).toBe(totalInDb);
    expect(page).toBe(1);
    expect(categories.length).toBeLessThanOrEqual(8);
    expect(totalPages).toBe(Math.ceil(totalInDb / 8));
    expect(categories[0]).toMatchObject({
      id: expect.any(String),
      name: expect.any(String),
      slug: expect.any(String),
      imageUrl: expect.any(String),
    });
  });

  it("getCategories ordena por name desc (igual ao Prisma)", async () => {
    const expectedOrder = await prisma.category.findMany({
      select: { name: true },
      orderBy: { name: "desc" },
      take: 8,
    });
    const { categories } = await getCategories({ page: 1, limit: 8 });

    expect(categories.map((c) => c.name)).toEqual(
      expectedOrder.map((c) => c.name),
    );
  });

  it("getCategories na segunda página retorna o restante", async () => {
    const totalInDb = await prisma.category.count();
    const limit = 8;
    const { categories, page } = await getCategories({ page: 2, limit });

    expect(page).toBe(2);
    expect(categories.length).toBe(totalInDb - limit);
  });

  it("getCategories com limit 0 retorna todas as categorias numa página", async () => {
    const totalInDb = await prisma.category.count();
    const result = await getCategories({ page: 5, limit: 0 });

    expect(result.categories.length).toBe(totalInDb);
    expect(result.page).toBe(1);
    expect(result.totalPages).toBe(1);
    expect(result.total).toBe(totalInDb);
  });

  it("getCategoryBySlug retorna categoria com produtos e imagens", async () => {
    const category = await getCategoryBySlug("informatica");

    expect(category).not.toBeNull();
    expect(category!.slug).toBe("informatica");
    expect(category!.products).toHaveLength(2);
    for (const p of category!.products) {
      expect(Array.isArray(p.images)).toBe(true);
      expect(p.images.length).toBeGreaterThan(0);
      expect(p.images[0]).toMatchObject({
        id: expect.any(String),
        url: expect.any(String),
      });
    }
  });

  it("getCategoryBySlug retorna null para slug inexistente", async () => {
    const category = await getCategoryBySlug("slug-que-nao-existe");
    expect(category).toBeNull();
  });

  it("getCategoryById retorna categoria existente", async () => {
    const row = await prisma.category.findFirst({
      where: { slug: "calcados" },
    });
    if (!row) throw new Error("Seed deve criar categoria calcados");

    const category = await getCategoryById(row.id);

    expect(category).not.toBeNull();
    expect(category!.id).toBe(row.id);
    expect(category!.slug).toBe("calcados");
  });

  it("getCategoryById retorna null para id inexistente", async () => {
    const category = await getCategoryById(
      "00000000-0000-0000-0000-000000000000",
    );
    expect(category).toBeNull();
  });
});
