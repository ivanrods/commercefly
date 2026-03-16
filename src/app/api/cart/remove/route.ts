import { auth } from "@clerk/nextjs/server";

import { NextResponse } from "next/server";
import prisma from "src/lib/prisma";

export async function POST(req: Request) {
  const { userId: clerkId } = await auth();

  if (!clerkId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { productId } = await req.json();

  const user = await prisma.user.findUnique({
    where: { clerkId },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" });
  }

  const cart = await prisma.cart.findUnique({
    where: { userId: user.id },
  });

  if (!cart) {
    return NextResponse.json({ error: "Cart not found" });
  }

  await prisma.cartItem.delete({
    where: {
      cartId_productId: {
        cartId: cart.id,
        productId,
      },
    },
  });

  return NextResponse.json({ success: true });
}
