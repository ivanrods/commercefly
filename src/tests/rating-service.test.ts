import {
  describe,
  it,
  expect,
  afterAll,
  beforeAll,
  afterEach,
  vi,
  beforeEach,
} from "vitest";
import prisma from "../lib/prisma";
import {
  submitRating,
  getProductRating,
} from "../services/rating-service";

describe("rating-service (client-side fetch)", () => {
  let fetchSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue({
      json: async () => ({ success: true }),
      ok: true,
    } as Response);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("submitRating chama POST /api/ratings com productId e value", async () => {
    await submitRating("prod-123", 4);

    expect(fetchSpy).toHaveBeenCalledWith("/api/ratings", {
      method: "POST",
      body: JSON.stringify({ productId: "prod-123", value: 4 }),
    });
  });

  it("getProductRating chama GET /api/ratings?productId= e retorna JSON", async () => {
    const mockData = {
      averageRating: 4.5,
      ratingCount: 10,
      userRating: 4,
    };
    fetchSpy.mockResolvedValueOnce({
      json: async () => mockData,
      ok: true,
    } as Response);

    const result = await getProductRating("prod-789");

    expect(fetchSpy).toHaveBeenCalledWith(
      "/api/ratings?productId=prod-789",
    );
    expect(result).toEqual(mockData);
  });

  it("submitRating lança erro quando resposta não é ok", async () => {
    fetchSpy.mockResolvedValueOnce({
      json: async () => ({ error: "Você precisa comprar o produto para avaliá-lo" }),
      ok: false,
    } as Response);

    await expect(
      submitRating("prod-123", 4),
    ).rejects.toThrow("Você precisa comprar o produto para avaliá-lo");
  });
});

describe("rating API (business logic)", () => {
  let testUserId: string;
  let otherUserId: string;
  let testProductId: string;

  beforeAll(async () => {
    const category = await prisma.category.findFirst();
    if (!category) throw new Error("Seed deve criar pelo menos uma categoria");

    const user = await prisma.user.create({
      data: {
        clerkId: `clerk-test-rating-${Date.now()}`,
        email: `rating-test-${Date.now()}@test.local`,
      },
    });
    testUserId = user.id;

    const otherUser = await prisma.user.create({
      data: {
        clerkId: `clerk-test-rating-other-${Date.now()}`,
        email: `rating-test-other-${Date.now()}@test.local`,
      },
    });
    otherUserId = otherUser.id;

    const product = await prisma.product.create({
      data: {
        name: "Test Product Rating",
        description: "Test product for rating tests",
        price: 100,
        stock: 10,
        categoryId: category.id,
        images: { create: { url: "https://example.com/img.png" } },
      },
    });
    testProductId = product.id;
  });

  afterEach(async () => {
    await prisma.rating.deleteMany({
      where: { userId: { in: [testUserId, otherUserId] } },
    });
  });

  afterAll(async () => {
    await prisma.rating.deleteMany({
      where: { userId: { in: [testUserId, otherUserId] } },
    });
    await prisma.product.deleteMany({
      where: { id: testProductId },
    });
    await prisma.user.deleteMany({
      where: { id: { in: [testUserId, otherUserId] } },
    });
    await prisma.$disconnect();
  });

  it("cria rating e persiste no banco", async () => {
    await prisma.rating.create({
      data: { userId: testUserId, productId: testProductId, value: 4 },
    });

    const rating = await prisma.rating.findUnique({
      where: {
        userId_productId: { userId: testUserId, productId: testProductId },
      },
    });

    expect(rating).not.toBeNull();
    expect(rating!.value).toBe(4);
  });

  it("atualiza rating existente (upsert)", async () => {
    await prisma.rating.create({
      data: { userId: testUserId, productId: testProductId, value: 2 },
    });

    await prisma.rating.upsert({
      where: {
        userId_productId: { userId: testUserId, productId: testProductId },
      },
      update: { value: 5 },
      create: { userId: testUserId, productId: testProductId, value: 5 },
    });

    const rating = await prisma.rating.findUnique({
      where: {
        userId_productId: { userId: testUserId, productId: testProductId },
      },
    });

    expect(rating!.value).toBe(5);
  });

  it("impede rating duplicado (unique constraint)", async () => {
    await prisma.rating.create({
      data: { userId: testUserId, productId: testProductId, value: 3 },
    });

    await expect(
      prisma.rating.create({
        data: { userId: testUserId, productId: testProductId, value: 4 },
      }),
    ).rejects.toThrow();
  });

  it("calcula média correta das avaliações", async () => {
    await prisma.rating.create({
      data: { userId: testUserId, productId: testProductId, value: 4 },
    });
    await prisma.rating.create({
      data: { userId: otherUserId, productId: testProductId, value: 2 },
    });

    const aggregated = await prisma.rating.aggregate({
      where: { productId: testProductId },
      _avg: { value: true },
      _count: { value: true },
    });

    expect(aggregated._avg.value).toBe(3);
    expect(aggregated._count.value).toBe(2);
  });

  it("retorna 0 para produto sem avaliações", async () => {
    const aggregated = await prisma.rating.aggregate({
      where: { productId: testProductId },
      _avg: { value: true },
      _count: { value: true },
    });

    expect(aggregated._avg.value).toBeNull();
    expect(aggregated._count.value).toBe(0);
  });

  it("atualiza product.rating e product.ratingCount após avaliação", async () => {
    await prisma.rating.create({
      data: { userId: testUserId, productId: testProductId, value: 5 },
    });

    const aggregated = await prisma.rating.aggregate({
      where: { productId: testProductId },
      _avg: { value: true },
      _count: { value: true },
    });

    const average = aggregated._avg.value ?? 0;
    const count = aggregated._count.value ?? 0;

    await prisma.product.update({
      where: { id: testProductId },
      data: {
        rating: Math.round(average * 10) / 10,
        ratingCount: count,
      },
    });

    const product = await prisma.product.findUnique({
      where: { id: testProductId },
    });

    expect(product!.rating).toBe(5);
    expect(product!.ratingCount).toBe(1);
  });

  it("permite apenas 1 rating por usuário por produto", async () => {
    await prisma.rating.create({
      data: { userId: testUserId, productId: testProductId, value: 3 },
    });

    const ratings = await prisma.rating.findMany({
      where: { userId: testUserId, productId: testProductId },
    });

    expect(ratings).toHaveLength(1);
  });

  it("retorna avaliação específica do usuário", async () => {
    await prisma.rating.create({
      data: { userId: testUserId, productId: testProductId, value: 4 },
    });

    const userRating = await prisma.rating.findFirst({
      where: { userId: testUserId, productId: testProductId },
    });

    expect(userRating).not.toBeNull();
    expect(userRating!.value).toBe(4);
  });
});
