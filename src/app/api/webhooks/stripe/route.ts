import prisma from "src/lib/prisma";
import { stripe } from "src/lib/stripe";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return new NextResponse("Missing signature", { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err) {
    console.error("Erro no webhook:", err);
    return new NextResponse("Webhook error", { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const userId = session.metadata?.userId;

    if (!userId) {
      return new NextResponse("userId missing", { status: 400 });
    }

    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart) {
      return new NextResponse("Cart not found", { status: 400 });
    }

    await prisma.order.create({
      data: {
        userId,
        orderNumber: `ORD-${Date.now()}`,
        totalAmount: session.amount_total ?? 0, // em centavos
        status: "PAID",

        items: {
          create: cart.items.map((item) => ({
            productId: item.productId,
            name: item.product.name,
            price: item.product.price,
            quantity: item.quantity,
          })),
        },
      },
    });

    await prisma.cartItem.deleteMany({
      where: {
        cart: {
          userId,
        },
      },
    });

    console.log("Pedido criado com itens:", userId);
  }

  return NextResponse.json({ received: true });
}
