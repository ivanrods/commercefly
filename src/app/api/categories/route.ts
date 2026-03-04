import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        name: "asc",
      },
      select: {
        id: true,
        name: true,
        slug: true,
      },
    });

    return NextResponse.json(categories);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Erro ao buscar categorias";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
