import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { categorySchema } from "@/validators/category-schema";

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
    const parse = categorySchema.safeParse(body);
    if (!parse.success) {
      return NextResponse.json(
        { error: parse.error.issues.map((e) => e.message).join(", ") },
        { status: 400 },
      );
    }
    const { name, slug, imageUrl } = parse.data;

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
