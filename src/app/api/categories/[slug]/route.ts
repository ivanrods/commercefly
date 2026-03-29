import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";

interface Params {
  params: {
    slug: string;
  };
}

export async function GET(req: Request, { params }: Params) {
  try {
    const { slug } = params;

    const category = await prisma.category.findUnique({
      where: { slug },
      select: {
        id: true,
        name: true,
        slug: true,
        products: {
          where: {
            stock: {
              gt: 0,
            },
          },
          select: {
            id: true,
            name: true,
            price: true,
            images: true,
            isFeatured: true,
          },
        },
      },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Categoria não encontrada" },
        { status: 404 },
      );
    }

    return NextResponse.json(category);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Erro ao buscar categoria";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
