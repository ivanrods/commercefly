import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import CartSection from "./cart-section";

export const metadata = {
  title: "Carrinho de Compras | Commercefly",
  description:
    "Revise seus produtos, ajuste quantidades e finalize sua compra com segurança na Commercefly.",
};

export default async function Page() {
  const { userId } = await auth();

  if (!userId) {
    return <div>Não autenticado</div>;
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (!user) return null;

  const cart = await prisma.cart.findUnique({
    where: { userId: user.id },
    include: {
      items: {
        include: {
          product: {
            include: { images: true },
          },
        },
      },
    },
  });

  return <CartSection initialCart={cart} />;
}
