import { describe, it, expect, afterAll, beforeAll } from "vitest";
import prisma from "../lib/prisma";
import { getOrders } from "../services/orders-service";

describe("orders-service", () => {
  let userWithOrdersId: string;
  let userWithoutOrdersId: string;
  let olderOrderId: string;
  let newerOrderId: string;

  beforeAll(async () => {
    const product = await prisma.product.findFirst({
      include: { images: true },
    });
    if (!product) throw new Error("Seed deve criar pelo menos um produto");

    const userWithOrders = await prisma.user.create({
      data: {
        clerkId: `clerk-test-orders-${Date.now()}`,
        email: `orders-test-${Date.now()}@test.local`,
      },
    });
    userWithOrdersId = userWithOrders.id;

    const userWithoutOrders = await prisma.user.create({
      data: {
        clerkId: `clerk-test-no-orders-${Date.now()}`,
        email: `no-orders-test-${Date.now()}@test.local`,
      },
    });
    userWithoutOrdersId = userWithoutOrders.id;

    const olderOrder = await prisma.order.create({
      data: {
        userId: userWithOrdersId,
        orderNumber: `ORD-TEST-OLDER-${Date.now()}`,
        totalAmount: 34900,
        status: "PAID",
        createdAt: new Date("2024-01-01"),
        items: {
          create: {
            productId: product.id,
            name: product.name,
            price: product.price * 100,
            quantity: 1,
          },
        },
      },
    });
    olderOrderId = olderOrder.id;

    const newerOrder = await prisma.order.create({
      data: {
        userId: userWithOrdersId,
        orderNumber: `ORD-TEST-NEWER-${Date.now()}`,
        totalAmount: 69800,
        status: "PENDING",
        createdAt: new Date("2025-06-01"),
        items: {
          create: {
            productId: product.id,
            name: product.name,
            price: product.price * 100,
            quantity: 2,
          },
        },
      },
    });
    newerOrderId = newerOrder.id;
  });

  afterAll(async () => {
    await prisma.user.deleteMany({
      where: {
        id: { in: [userWithOrdersId, userWithoutOrdersId].filter(Boolean) },
      },
    });
    await prisma.$disconnect();
  });

  it("getOrders retorna lista vazia para usuário sem pedidos", async () => {
    const orders = await getOrders(userWithoutOrdersId);
    expect(orders).toEqual([]);
  });

  it("getOrders retorna apenas pedidos do usuário informado", async () => {
    const orders = await getOrders(userWithOrdersId);

    expect(orders).toHaveLength(2);
    expect(orders.every((o) => o.userId === userWithOrdersId)).toBe(true);
  });

  it("getOrders inclui items com product e images", async () => {
    const orders = await getOrders(userWithOrdersId);

    for (const order of orders) {
      expect(order.items.length).toBeGreaterThan(0);
      const item = order.items[0];
      expect(item.product).toBeDefined();
      expect(Array.isArray(item.product.images)).toBe(true);
      expect(item.product.images.length).toBeGreaterThan(0);
      expect(item.product.images[0]).toMatchObject({
        id: expect.any(String),
        url: expect.any(String),
      });
    }
  });

  it("getOrders ordena por createdAt desc", async () => {
    const orders = await getOrders(userWithOrdersId);

    expect(orders[0].id).toBe(newerOrderId);
    expect(orders[1].id).toBe(olderOrderId);
    for (let i = 0; i < orders.length - 1; i++) {
      expect(orders[i].createdAt >= orders[i + 1].createdAt).toBe(true);
    }
  });

  it("getOrders retorna lista vazia para userId inexistente", async () => {
    const orders = await getOrders(
      "00000000-0000-0000-0000-000000000000",
    );
    expect(orders).toEqual([]);
  });
});
