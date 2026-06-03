import prisma from "../lib/prisma";

type GetCategoriesParams = {
  page?: number;
  limit?: number;
};

export async function getCategories({
  page = 1,
  limit = 8,
}: GetCategoriesParams) {
  const isAll = !limit || limit === 0;

  const [categories, total] = await Promise.all([
    prisma.category.findMany({
      ...(isAll
        ? {}
        : {
            skip: (page - 1) * limit,
            take: limit,
          }),
      orderBy: {
        name: "desc",
      },
      select: {
        id: true,
        name: true,
        slug: true,
        imageUrl: true,
        _count: {
          select: {
            products: true,
          },
        },
      },
    }),
    prisma.category.count(),
  ]);

  return {
    categories,
    total,
    page: isAll ? 1 : page,
    totalPages: isAll ? 1 : Math.ceil(total / limit),
  };
}

export async function getCategoryBySlug(slug: string) {
  return prisma.category.findUnique({
    where: {
      slug,
    },
    include: {
      products: {
        include: {
          images: {
            select: {
              id: true,
              url: true,
            },
          },
        },
      },
    },
  });
}

export async function getCategoryById(id: string) {
  const category = await prisma.category.findUnique({
    where: {
      id,
    },
  });

  return category;
}
