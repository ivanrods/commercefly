import { auth, currentUser } from "@clerk/nextjs/server";
import prisma from "../../../../lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { userId: clerkId } = await auth();

  if (!clerkId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const clerkUser = await currentUser();
  const { items } = await req.json();

  if (!items || items.length === 0) {
    return NextResponse.json({ success: true });
  }

  let user = await prisma.user.findUnique({
    where: { clerkId },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        clerkId,
        email: clerkUser?.emailAddresses[0]?.emailAddress ?? "",
        name: clerkUser?.firstName ?? "",
      },
    });
  }

  let cart = await prisma.cart.findUnique({
    where: { userId: user.id },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: {
        userId: user.id,
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
      cartId: cart.id,
      productId: item.productId,
      quantity: item.quantity,
    })),
  });

  return NextResponse.json({ success: true });
}
