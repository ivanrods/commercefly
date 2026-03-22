import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "src/lib/prisma";
import { stripe } from "src/lib/stripe";

export async function POST() {
  const { userId: clerkId } = await auth();

  if (!clerkId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { clerkId },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" });
  }

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

  if (!cart || cart.items.length === 0) {
    return NextResponse.json({ error: "Cart vazio" });
  }

  const line_items = cart.items.map((item) => ({
    price_data: {
      currency: "brl",
      product_data: {
        name: item.product.name,
        images: [item.product.imageUrl],
      },
      unit_amount: item.product.price,
    },
    quantity: item.quantity,
  }));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items,
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cart`,
    metadata: {
      userId: user.id,
    },
  });

  return NextResponse.json({ url: session.url });
}
