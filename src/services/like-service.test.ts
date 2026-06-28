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
  addLike,
  removeLike,
  getLikes,
  isProductLiked,
  getProductLikeCount,
} from "../services/like-service";

describe("like-service (client-side fetch)", () => {
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

  it("addLike chama POST /api/likes/add com productId", async () => {
    await addLike("prod-123");

    expect(fetchSpy).toHaveBeenCalledWith("/api/likes/add", {
      method: "POST",
      body: JSON.stringify({ productId: "prod-123" }),
    });
  });

  it("removeLike chama POST /api/likes/remove com productId", async () => {
    await removeLike("prod-456");

    expect(fetchSpy).toHaveBeenCalledWith("/api/likes/remove", {
      method: "POST",
      body: JSON.stringify({ productId: "prod-456" }),
    });
  });

  it("getLikes chama GET /api/likes e retorna JSON", async () => {
    const mockData = [{ id: "prod-1", name: "Produto Curtido" }];
    fetchSpy.mockResolvedValueOnce({
      json: async () => mockData,
      ok: true,
    } as Response);

    const result = await getLikes();

    expect(fetchSpy).toHaveBeenCalledWith("/api/likes");
    expect(result).toEqual(mockData);
  });

  it("isProductLiked chama GET /api/likes/check?productId= e retorna isLiked", async () => {
    fetchSpy.mockResolvedValueOnce({
      json: async () => ({ isLiked: true }),
      ok: true,
    } as Response);

    const result = await isProductLiked("prod-789");

    expect(fetchSpy).toHaveBeenCalledWith(
      "/api/likes/check?productId=prod-789",
    );
    expect(result).toEqual({ isLiked: true });
  });

  it("getProductLikeCount chama GET /api/likes/count?productId= e retorna count", async () => {
    fetchSpy.mockResolvedValueOnce({
      json: async () => ({ count: 5 }),
      ok: true,
    } as Response);

    const result = await getProductLikeCount("prod-789");

    expect(fetchSpy).toHaveBeenCalledWith(
      "/api/likes/count?productId=prod-789",
    );
    expect(result).toEqual({ count: 5 });
  });
});

describe("like API (business logic)", () => {
  let testUserId: string;
  let testProductId: string;
  let testProductId2: string;

  beforeAll(async () => {
    const category = await prisma.category.findFirst();
    if (!category) throw new Error("Seed deve criar pelo menos uma categoria");

    const user = await prisma.user.create({
      data: {
        clerkId: `clerk-test-like-${Date.now()}`,
        email: `like-test-${Date.now()}@test.local`,
      },
    });
    testUserId = user.id;

    const product1 = await prisma.product.create({
      data: {
        name: "Test Product Like 1",
        description: "Test product for like tests",
        price: 100,
        stock: 10,
        categoryId: category.id,
        images: { create: { url: "https://example.com/img1.png" } },
      },
    });
    testProductId = product1.id;

    const product2 = await prisma.product.create({
      data: {
        name: "Test Product Like 2",
        description: "Second test product for like tests",
        price: 200,
        stock: 5,
        categoryId: category.id,
        images: { create: { url: "https://example.com/img2.png" } },
      },
    });
    testProductId2 = product2.id;
  });

  afterEach(async () => {
    await prisma.like.deleteMany({
      where: { userId: testUserId },
    });
  });

  afterAll(async () => {
    await prisma.like.deleteMany({
      where: { userId: testUserId },
    });
    await prisma.product.deleteMany({
      where: { id: { in: [testProductId, testProductId2] } },
    });
    await prisma.user.deleteMany({ where: { id: testUserId } });
    await prisma.$disconnect();
  });

  it("cria like e persiste no banco", async () => {
    await prisma.like.create({
      data: { userId: testUserId, productId: testProductId },
    });

    const like = await prisma.like.findUnique({
      where: {
        userId_productId: { userId: testUserId, productId: testProductId },
      },
    });

    expect(like).not.toBeNull();
    expect(like!.userId).toBe(testUserId);
    expect(like!.productId).toBe(testProductId);
  });

  it("impede like duplicado (unique constraint)", async () => {
    await prisma.like.create({
      data: { userId: testUserId, productId: testProductId },
    });

    await expect(
      prisma.like.create({
        data: { userId: testUserId, productId: testProductId },
      }),
    ).rejects.toThrow();
  });

  it("remove like do banco", async () => {
    await prisma.like.create({
      data: { userId: testUserId, productId: testProductId },
    });

    await prisma.like.delete({
      where: {
        userId_productId: { userId: testUserId, productId: testProductId },
      },
    });

    const deleted = await prisma.like.findUnique({
      where: {
        userId_productId: { userId: testUserId, productId: testProductId },
      },
    });

    expect(deleted).toBeNull();
  });

  it("verifica se produto foi curtido (isLiked true)", async () => {
    await prisma.like.create({
      data: { userId: testUserId, productId: testProductId },
    });

    const like = await prisma.like.findUnique({
      where: {
        userId_productId: { userId: testUserId, productId: testProductId },
      },
    });

    expect(like).not.toBeNull();
  });

  it("verifica se produto NÃO foi curtido (isLiked false)", async () => {
    const like = await prisma.like.findUnique({
      where: {
        userId_productId: { userId: testUserId, productId: testProductId },
      },
    });

    expect(like).toBeNull();
  });

  it("retorna contagem correta de likes de um produto", async () => {
    await prisma.like.create({
      data: { userId: testUserId, productId: testProductId },
    });

    const count = await prisma.like.count({
      where: { productId: testProductId },
    });

    expect(count).toBe(1);
  });

  it("retorna 0 para produto sem likes", async () => {
    const count = await prisma.like.count({
      where: { productId: testProductId },
    });

    expect(count).toBe(0);
  });

  it("retorna lista de produtos curtidos com imagens", async () => {
    await prisma.like.create({
      data: { userId: testUserId, productId: testProductId },
    });

    const likes = await prisma.like.findMany({
      where: { userId: testUserId },
      include: {
        product: {
          include: {
            images: true,
          },
        },
      },
    });

    expect(likes).toHaveLength(1);
    expect(likes[0].product.images.length).toBeGreaterThan(0);
    expect(likes[0].product.images[0]).toMatchObject({
      id: expect.any(String),
      url: expect.any(String),
    });
  });

  it("lida com múltiplos likes de um usuário", async () => {
    await prisma.like.create({
      data: { userId: testUserId, productId: testProductId },
    });
    await prisma.like.create({
      data: { userId: testUserId, productId: testProductId2 },
    });

    const likes = await prisma.like.findMany({
      where: { userId: testUserId },
    });

    expect(likes).toHaveLength(2);
  });
});
