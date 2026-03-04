import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";
import { requireAdmin } from "../../../lib/auth";

export async function POST(req: Request) {
  try {
    await requireAdmin();

    const body = await req.json();

    const {
      name,
      description,
      price,
      imageUrl,
      stock,
      isFeatured,
      categoryId,
    } = body;

    if (!name || !description || !price || !categoryId) {
      return NextResponse.json(
        { error: "Campos obrigatórios faltando" },
        { status: 400 },
      );
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        imageUrl,
        stock,
        isFeatured,
        categoryId,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Erro interno";

    return NextResponse.json({ error: message }, { status: 401 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    // Paginação
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 8;
    const skip = (page - 1) * limit;

    // Filtros
    const categorySlug = searchParams.get("category");
    const search = searchParams.get("search");
    const featured = searchParams.get("featured");

    // Construção dinâmica do where
    const where: Record<string, unknown> = {
      stock: {
        gt: 0,
      },
    };

    if (categorySlug) {
      where.category = {
        slug: categorySlug,
      };
    }

    if (search) {
      where.OR = [
        {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: search,
            mode: "insensitive",
          },
        },
      ];
    }

    if (featured === "true") {
      where.isFeatured = true;
    }

    // Buscar produtos
    const products = await prisma.product.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        imageUrl: true,
        stock: true,
        isFeatured: true,
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    // Total para paginação
    const totalProducts = await prisma.product.count({ where });

    return NextResponse.json({
      data: products,
      meta: {
        total: totalProducts,
        page,
        limit,
        totalPages: Math.ceil(totalProducts / limit),
      },
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Erro ao buscar produtos";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
