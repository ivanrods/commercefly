import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
import { requireAdmin } from "src/lib/auth";
import z from "zod";

interface Params {
  params: Promise<{
    id: string;
  }>;
}

const productSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  description: z.string().min(5, "Descrição muito curta"),
  price: z.number().int().positive("Preço deve ser maior que 0"),
  images: z
    .array(z.string().url("URL inválida"))
    .min(1, "Adicione pelo menos uma imagem"),
  stock: z.number().int().min(0, "Estoque não pode ser negativo"),
  isFeatured: z.boolean().optional().default(false),
  categoryId: z.string().uuid("Categoria inválida"),
});

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdmin();

    const { id } = await params;

    const body = await req.json();

    const parsed = productSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Erro de validação",
          issues: parsed.error.format(),
        },
        { status: 400 },
      );
    }

    const data = parsed.data;

    const product = await prisma.product.update({
      where: {
        id: id,
      },
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        stock: data.stock,
        isFeatured: data.isFeatured,
        categoryId: data.categoryId,

        images: {
          deleteMany: {},
          create: data.images.map((url) => ({
            url,
          })),
        },
      },
      include: {
        images: true,
        category: true,
      },
    });

    return NextResponse.json({
      message: "Produto atualizado com sucesso",
      data: product,
    });
  } catch (error: unknown) {
    console.error(error);

    const message =
      error instanceof Error ? error.message : "Erro interno do servidor";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: Params) {
  try {
    await requireAdmin();

    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: "ID não informado" }, { status: 400 });
    }

    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Produto deletado" });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Erro ao deletar produto" },
      { status: 500 },
    );
  }
}
