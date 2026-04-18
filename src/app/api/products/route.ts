import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";
import { requireAdmin } from "../../../lib/auth";
import { z } from "zod";

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

export async function POST(req: Request) {
  try {
    await requireAdmin();

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

    const product = await prisma.product.create({
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        stock: data.stock,
        isFeatured: data.isFeatured,
        categoryId: data.categoryId,
        images: {
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

    return NextResponse.json(
      {
        message: "Produto criado com sucesso",
        data: product,
      },
      { status: 201 },
    );
  } catch (error: unknown) {
    console.error(error);

    const message =
      error instanceof Error ? error.message : "Erro interno do servidor";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
