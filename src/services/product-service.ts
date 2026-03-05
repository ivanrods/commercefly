import prisma from "../lib/prisma";

type GetProductsParams = {
  page?: number;
  limit?: number;
  category?: string;
  featured?: boolean;
};

export async function getProducts({
  page = 1,
  limit = 8,
  category,
  featured,
}: GetProductsParams) {
  const skip = (page - 1) * limit;

  const where: Record<string, unknown> = {};

  if (category) {
    where.category = {
      slug: category,
    };
  }

  if (featured) {
    where.isFeatured = true;
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        category: true,
      },
    }),

    prisma.product.count({ where }),
  ]);

  return {
    products,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getProductById(id: string) {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
    },
  });

  return product;
}

export async function getFeaturedProducts() {
  return prisma.product.findMany({
    where: {
      isFeatured: true,
    },
    take: 4,
    include: {
      category: true,
    },
  });
}

export async function getProductsByCategory(slug: string) {
  return prisma.product.findMany({
    where: {
      category: {
        slug,
      },
    },
    include: {
      category: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}
