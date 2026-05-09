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
  const isAll = !limit || limit === 0;

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
      ...(isAll
        ? {}
        : {
            skip: (page - 1) * limit,
            take: limit,
          }),
      orderBy: {
        createdAt: "desc",
      },
      include: {
        category: true,
        images: true,
      },
    }),

    prisma.product.count({ where }),
  ]);

  return {
    products,
    total,
    page: isAll ? 1 : page,
    totalPages: isAll ? 1 : Math.ceil(total / limit),
  };
}

export async function getProductById(id: string) {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      images: true,
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
      images: true,
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
      images: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function searchProducts({
  query,
  page = 1,
  limit = 12,
}: {
  query?: string;
  page?: number;
  limit?: number;
}) {
  const where: Record<string, unknown> = {};

  if (query) {
    where.OR = [
      {
        name: {
          contains: query,
          mode: "insensitive",
        },
      },
      {
        description: {
          contains: query,
          mode: "insensitive",
        },
      },
    ];
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        category: true,
        images: true,
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
