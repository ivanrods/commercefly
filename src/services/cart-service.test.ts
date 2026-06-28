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
  addToCart,
  getCart,
  removeFromCart,
  decrementCartItem,
} from "../services/cart-service";

describe("cart-service (client-side fetch)", () => {
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

  it("addToCart calls POST /api/cart/add with productId", async () => {
    await addToCart("prod-123");

    expect(fetchSpy).toHaveBeenCalledWith("/api/cart/add", {
      method: "POST",
      body: JSON.stringify({ productId: "prod-123" }),
    });
  });

  it("getCart calls GET /api/cart and returns JSON", async () => {
    const mockData = { id: "cart-1", items: [] };
    fetchSpy.mockResolvedValueOnce({
      json: async () => mockData,
      ok: true,
    } as Response);

    const result = await getCart();

    expect(fetchSpy).toHaveBeenCalledWith("/api/cart");
    expect(result).toEqual(mockData);
  });

  it("removeFromCart calls POST /api/cart/remove with productId", async () => {
    await removeFromCart("prod-456");

    expect(fetchSpy).toHaveBeenCalledWith("/api/cart/remove", {
      method: "POST",
      body: JSON.stringify({ productId: "prod-456" }),
    });
  });

  it("decrementCartItem calls POST /api/cart/decrement with productId", async () => {
    await decrementCartItem("prod-789");

    expect(fetchSpy).toHaveBeenCalledWith("/api/cart/decrement", {
      method: "POST",
      body: JSON.stringify({ productId: "prod-789" }),
    });
  });
});

describe("cart API (business logic)", () => {
  let testUserId: string;
  let testProductId: string;
  let testProductId2: string;

  beforeAll(async () => {
    const category = await prisma.category.findFirst();
    if (!category) throw new Error("Seed deve criar pelo menos uma categoria");

    const user = await prisma.user.create({
      data: {
        clerkId: `clerk-test-cart-${Date.now()}`,
        email: `cart-test-${Date.now()}@test.local`,
      },
    });
    testUserId = user.id;

    const product1 = await prisma.product.create({
      data: {
        name: "Test Product Cart 1",
        description: "Test product for cart tests",
        price: 100,
        stock: 10,
        categoryId: category.id,
        images: { create: { url: "https://example.com/img1.png" } },
      },
    });
    testProductId = product1.id;

    const product2 = await prisma.product.create({
      data: {
        name: "Test Product Cart 2",
        description: "Second test product for cart tests",
        price: 200,
        stock: 5,
        categoryId: category.id,
        images: { create: { url: "https://example.com/img2.png" } },
      },
    });
    testProductId2 = product2.id;
  });

  afterEach(async () => {
    await prisma.cartItem.deleteMany({
      where: { cart: { userId: testUserId } },
    });
    await prisma.cart.deleteMany({ where: { userId: testUserId } });
  });

  afterAll(async () => {
    await prisma.cartItem.deleteMany({
      where: { cart: { userId: testUserId } },
    });
    await prisma.cart.deleteMany({ where: { userId: testUserId } });
    await prisma.product.deleteMany({
      where: { id: { in: [testProductId, testProductId2] } },
    });
    await prisma.user.deleteMany({ where: { id: testUserId } });
    await prisma.$disconnect();
  });

  it("cria carrinho automaticamente ao adicionar primeiro item", async () => {
    const cart = await prisma.cart.create({ data: { userId: testUserId } });

    const item = await prisma.cartItem.create({
      data: { cartId: cart.id, productId: testProductId, quantity: 1 },
    });

    expect(item).toMatchObject({
      cartId: cart.id,
      productId: testProductId,
      quantity: 1,
    });
  });

  it("incrementa quantity ao adicionar produto já existente", async () => {
    const cart = await prisma.cart.create({ data: { userId: testUserId } });

    await prisma.cartItem.create({
      data: { cartId: cart.id, productId: testProductId, quantity: 1 },
    });

    await prisma.cartItem.update({
      where: {
        cartId_productId: { cartId: cart.id, productId: testProductId },
      },
      data: { quantity: { increment: 1 } },
    });

    const updated = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: { cartId: cart.id, productId: testProductId },
      },
    });
    expect(updated!.quantity).toBe(2);
  });

  it("retorna carrinho com itens incluindo imagens do produto", async () => {
    const cart = await prisma.cart.create({ data: { userId: testUserId } });

    await prisma.cartItem.create({
      data: { cartId: cart.id, productId: testProductId, quantity: 2 },
    });

    const result = await prisma.cart.findUnique({
      where: { userId: testUserId },
      include: {
        items: {
          include: {
            product: { include: { images: true } },
          },
        },
      },
    });

    expect(result).not.toBeNull();
    expect(result!.items).toHaveLength(1);
    expect(result!.items[0].quantity).toBe(2);
    expect(result!.items[0].product.images.length).toBeGreaterThan(0);
    expect(result!.items[0].product.images[0]).toMatchObject({
      id: expect.any(String),
      url: expect.any(String),
    });
  });

  it("decrementa quantity quando qty > 1", async () => {
    const cart = await prisma.cart.create({ data: { userId: testUserId } });

    await prisma.cartItem.create({
      data: { cartId: cart.id, productId: testProductId, quantity: 2 },
    });

    await prisma.cartItem.update({
      where: {
        cartId_productId: { cartId: cart.id, productId: testProductId },
      },
      data: { quantity: { decrement: 1 } },
    });

    const updated = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: { cartId: cart.id, productId: testProductId },
      },
    });

    expect(updated).not.toBeNull();
    expect(updated!.quantity).toBe(1);
  });

  it("remove item ao decrementar com qty === 1", async () => {
    const cart = await prisma.cart.create({ data: { userId: testUserId } });

    await prisma.cartItem.create({
      data: { cartId: cart.id, productId: testProductId, quantity: 1 },
    });

    await prisma.cartItem.delete({
      where: {
        cartId_productId: { cartId: cart.id, productId: testProductId },
      },
    });

    const deleted = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: { cartId: cart.id, productId: testProductId },
      },
    });
    expect(deleted).toBeNull();
  });

  it("remove item completamente via removeFromCart", async () => {
    const cart = await prisma.cart.create({ data: { userId: testUserId } });

    await prisma.cartItem.create({
      data: { cartId: cart.id, productId: testProductId, quantity: 3 },
    });

    await prisma.cartItem.delete({
      where: {
        cartId_productId: { cartId: cart.id, productId: testProductId },
      },
    });

    const removed = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: { cartId: cart.id, productId: testProductId },
      },
    });
    expect(removed).toBeNull();
  });

  it("retorna null para usuário sem carrinho", async () => {
    const cart = await prisma.cart.findUnique({
      where: { userId: testUserId },
    });
    expect(cart).toBeNull();
  });

  it("lida com múltiplos itens no carrinho", async () => {
    const cart = await prisma.cart.create({ data: { userId: testUserId } });

    await prisma.cartItem.create({
      data: { cartId: cart.id, productId: testProductId, quantity: 1 },
    });
    await prisma.cartItem.create({
      data: { cartId: cart.id, productId: testProductId2, quantity: 2 },
    });

    const result = await prisma.cart.findUnique({
      where: { userId: testUserId },
      include: { items: true },
    });

    expect(result!.items).toHaveLength(2);
    const totalQty = result!.items.reduce((acc, i) => acc + i.quantity, 0);
    expect(totalQty).toBe(3);
  });
});
