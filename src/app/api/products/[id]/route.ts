import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";

interface Params {
  params: {
    id: string;
  };
}

export async function GET(req: Request, { params }: Params) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: "ID não informado" }, { status: 400 });
    }

    const product = await prisma.product.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        images: true,
        stock: true,
        isFeatured: true,
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        createdAt: true,
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Produto não encontrado" },
        { status: 404 },
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Erro ao buscar produto";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
