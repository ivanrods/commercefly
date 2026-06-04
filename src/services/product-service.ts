import prisma from "../lib/prisma";

type GetProductsParams = {
  page?: number;
  limit?: number;
  category?: string;
  featured?: boolean;
  search?: string;     // busca textual por nome/descrição
  priceMin?: number;   // filtro de preço mínimo
  priceMax?: number;   // filtro de preço máximo
  sort?: string;       // ordenação: featured, newest, price-low, price-high, rating
};

export async function getProducts({
  page = 1,
  limit = 8,
  category,
  featured,
  search,
  priceMin,
  priceMax,
  sort,
}: GetProductsParams) {
  const isAll = !limit || limit === 0;

  const where: Record<string, unknown> = {};

  // filtro por categoria (agora por categoryId, não mais por slug)
  if (category) {
    where.categoryId = category;
  }

  if (featured) {
    where.isFeatured = true;
  }

  // busca textual com case insensitive no nome ou descrição
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  // filtro por faixa de preço (gte / lte)
  if (priceMin !== undefined || priceMax !== undefined) {
    const priceFilter: Record<string, unknown> = {};
    if (priceMin !== undefined) priceFilter.gte = priceMin;
    if (priceMax !== undefined) priceFilter.lte = priceMax;
    where.price = priceFilter;
  }

  // orderBy dinâmico conforme o sort selecionado
  let orderBy:
    | Record<string, unknown>
    | Record<string, unknown>[] = { createdAt: "desc" };

  if (sort === "price-low") orderBy = { price: "asc" };
  else if (sort === "price-high") orderBy = { price: "desc" };
  else if (sort === "rating") orderBy = { rating: "desc" };
  else if (sort === "newest") orderBy = { createdAt: "desc" };
  // "featured" usa array de critérios: primeiro isFeatured, depois createdAt
  else if (sort === "featured")
    orderBy = [{ isFeatured: "desc" }, { createdAt: "desc" }];

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      ...(isAll
        ? {}
        : {
            skip: (page - 1) * limit,
            take: limit,
          }),
      orderBy,
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
