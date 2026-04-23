import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
import { requireAdmin } from "@/lib/auth";

interface Params {
  params: Promise<{
    slug: string;
  }>;
}

export async function GET(req: Request, { params }: Params) {
  try {
    const { slug } = await params;

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

export async function PATCH(req: Request, { params }: Params) {
  try {
    await requireAdmin();

    const { slug } = await params;

    const body = await req.json();

    const { name, newSlug, imageUrl } = body;

    if (!slug) {
      return NextResponse.json(
        { error: "Categoria não encontrada" },
        { status: 400 },
      );
    }

    if (!name || !newSlug) {
      return NextResponse.json(
        { error: "Name e slug são obrigatórios" },
        { status: 400 },
      );
    }

    const categoryExists = await prisma.category.findUnique({
      where: { slug: newSlug },
    });

    if (categoryExists && categoryExists.slug !== slug) {
      return NextResponse.json(
        { error: "Já existe uma categoria com esse slug" },
        { status: 409 },
      );
    }

    const updatedCategory = await prisma.category.update({
      where: { slug },
      data: {
        name,
        slug: newSlug,
        imageUrl: imageUrl ?? null,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        imageUrl: true,
      },
    });

    return NextResponse.json(updatedCategory, { status: 200 });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Erro ao atualizar categoria" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: Request, { params }: Params) {
  try {
    await requireAdmin();

    const { slug } = await params;

    if (!slug) {
      return NextResponse.json(
        { error: "Categoria não encontrada" },
        { status: 400 },
      );
    }

    await prisma.category.delete({
      where: { slug },
    });

    return NextResponse.json({ message: "Categoria deletada" });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Erro ao deletar categoria" },
      { status: 500 },
    );
  }
}
