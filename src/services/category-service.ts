import prisma from "../lib/prisma";

export async function getCategories() {
  const categories = await prisma.category.findMany({
    orderBy: {
      name: "asc",
    },
    select: {
      id: true,
      name: true,
      slug: true,
      imageUrl: true,
    },
  });

  return categories;
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
