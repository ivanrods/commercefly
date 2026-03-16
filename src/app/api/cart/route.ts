import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "src/lib/prisma";

export async function GET() {
  const { userId: clerkId } = await auth();

  if (!clerkId) return NextResponse.json(null);

  const user = await prisma.user.findUnique({
    where: { clerkId },
  });

  if (!user) return NextResponse.json(null);

  const cart = await prisma.cart.findUnique({
    where: { userId: user.id },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  return NextResponse.json(cart);
}
