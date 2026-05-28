import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get("productId");

  if (!productId) {
    return NextResponse.json(
      { error: "Product ID is required" },
      { status: 400 },
    );
  }

  try {
    const { userId: clerkId } = await auth();

    const [aggregated, userRating] = await Promise.all([
      prisma.rating.aggregate({
        where: { productId },
        _avg: { value: true },
        _count: { value: true },
      }),
      clerkId
        ? prisma.rating.findFirst({
            where: {
              productId,
              user: { clerkId },
            },
          })
        : Promise.resolve(null),
    ]);

    return NextResponse.json({
      averageRating: aggregated._avg.value ?? 0,
      ratingCount: aggregated._count.value ?? 0,
      userRating: userRating?.value ?? null,
    });
  } catch (error) {
    console.error("Error fetching ratings:", error);
    return NextResponse.json(
      { error: "Failed to fetch ratings" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  const { userId: clerkId } = await auth();

  if (!clerkId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { productId, value } = await req.json();

  if (!productId) {
    return NextResponse.json(
      { error: "Product ID is required" },
      { status: 400 },
    );
  }

  if (!Number.isInteger(value) || value < 1 || value > 5) {
    return NextResponse.json(
      { error: "Rating value must be an integer between 1 and 5" },
      { status: 400 },
    );
  }

  try {
    const user = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    await prisma.rating.upsert({
      where: {
        userId_productId: {
          userId: user.id,
          productId,
        },
      },
      update: { value },
      create: {
        userId: user.id,
        productId,
        value,
      },
    });

    const aggregated = await prisma.rating.aggregate({
      where: { productId },
      _avg: { value: true },
      _count: { value: true },
    });

    const average = aggregated._avg.value ?? 0;
    const count = aggregated._count.value ?? 0;

    await prisma.product.update({
      where: { id: productId },
      data: {
        rating: Math.round(average * 10) / 10,
        ratingCount: count,
      },
    });

    return NextResponse.json({
      averageRating: Math.round(average * 10) / 10,
      ratingCount: count,
      userRating: value,
    });
  } catch (error) {
    console.error("Error submitting rating:", error);
    return NextResponse.json(
      { error: "Failed to submit rating" },
      { status: 500 },
    );
  }
}
