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
    const count = await prisma.like.count({
      where: { productId },
    });

    return NextResponse.json({ count });
  } catch (error) {
    console.error("Error counting likes:", error);
    return NextResponse.json(
      { error: "Failed to count likes" },
      { status: 500 },
    );
  }
}
