import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import LikesSection from "./likes-section";

export const metadata = {
  title: "Meus Favoritos | Commercefly",
  description:
    "Veja todos os produtos que você marcou como favorito na Commercefly.",
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

  const likes = await prisma.like.findMany({
    where: { userId: user.id },
    include: {
      product: {
        include: {
          images: true,
          category: true,
          _count: {
            select: { likes: true },
          },
        },
      },
    },
  });

  const products = likes.map((like) => like.product);

  return <LikesSection initialProducts={products} />;
}
