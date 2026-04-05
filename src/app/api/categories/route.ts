import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";
import { requireAdmin } from "src/lib/auth";

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

export async function POST(request: Request) {
  try {
    await requireAdmin();

    const body = await request.json();

    const { name, slug, imageUrl } = body;

    if (!name || !slug) {
      return NextResponse.json(
        { error: "Name and slug are required" },
        { status: 400 },
      );
    }

    const categoryExists = await prisma.category.findUnique({
      where: { slug },
    });

    if (categoryExists) {
      return NextResponse.json(
        { error: "Category with this slug already exists" },
        { status: 409 },
      );
    }

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        imageUrl: imageUrl ?? null,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        imageUrl: true,
      },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
