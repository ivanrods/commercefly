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

  const item = await prisma.cartItem.findUnique({
    where: {
      cartId_productId: {
        cartId: cart.id,
        productId,
      },
    },
  });

  if (!item) {
    return NextResponse.json({ error: "Item not found" });
  }

  if (item.quantity === 1) {
    await prisma.cartItem.delete({
      where: { id: item.id },
    });
  } else {
    await prisma.cartItem.update({
      where: { id: item.id },
      data: {
        quantity: item.quantity - 1,
      },
    });
  }

  return NextResponse.json({ success: true });
}
