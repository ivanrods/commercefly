import prisma from "../lib/prisma";

export async function getOrders(userId: string) {
  const orders = await prisma.order.findMany({
    where: {
      userId: userId,
    },
    include: {
      items: {
        include: {
          product: {
            include: {
              images: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return orders;
}

export async function getAllOrders() {
  const orders = await prisma.order.findMany({
    include: {
      items: {
        include: {
          product: {
            include: {
              images: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return orders;
}
