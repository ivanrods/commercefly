import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const { userId: clerkId } = await auth();

  if (!clerkId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { clerkId },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  try {
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

    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching likes:", error);
    return NextResponse.json(
      { error: "Failed to fetch likes" },
      { status: 500 },
    );
  }
}
