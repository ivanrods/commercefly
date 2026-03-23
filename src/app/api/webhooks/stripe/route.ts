import { headers } from "next/headers";
import prisma from "src/lib/prisma";
import { stripe } from "src/lib/stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const sig = headers().get("stripe-signature")!;

  const event = stripe.webhooks.constructEvent(
    body,
    sig,
    process.env.STRIPE_WEBHOOK_SECRET!,
  );

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    const userId = session.metadata?.userId;

    await prisma.order.create({
      data: {
        userId,
        total: session.amount_total ?? 0,
        status: "PAID",
      },
    });

    await prisma.cartItem.deleteMany({
      where: {
        cart: {
          userId,
        },
      },
    });
  }

  return new Response("ok");
}
