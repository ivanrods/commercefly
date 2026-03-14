import { auth } from "@clerk/nextjs/server";
import prisma from "../../../../lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { items } = await req.json();

  let cart = await prisma.cart.findUnique({
    where: { userId },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: {
        userId,
      },
    });
  }

  // remove itens antigos
  await prisma.cartItem.deleteMany({
    where: { cartId: cart.id },
  });

  // cria novos itens
  await prisma.cartItem.createMany({
    data: items.map((item: any) => ({
      cartId: cart!.id,
      productId: item.productId,
      quantity: item.quantity,
    })),
  });

  return NextResponse.json({ success: true });
}
