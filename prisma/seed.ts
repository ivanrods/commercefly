import prisma from "../src/lib/prisma";

async function main() {
  await prisma.category.createMany({
    data: [
      { name: "Calçados", slug: "calcados", imageUrl: "Footprints" },
      {
        name: "Beleza e Cosméticos",
        slug: "beleza-e-cosmeticos",
        imageUrl: "Sparkles",
      },
      {
        name: "Esportes e Lazer",
        slug: "esportes-e-lazer",
        imageUrl: "Dumbbell",
      },
      { name: "Casa e Decoração", slug: "casa-e-decoracao", imageUrl: "Home" },
      { name: "Informática", slug: "informatica", imageUrl: "Laptop" },
      { name: "Brinquedos", slug: "brinquedos", imageUrl: "Puzzle" },
      { name: "Ferramentas", slug: "ferramentas", imageUrl: "Wrench" },
      { name: "Pet Shop", slug: "pet-shop", imageUrl: "Dog" },
      { name: "Saúde", slug: "saude", imageUrl: "HeartPulse" },
      {
        name: "Alimentos e Bebidas",
        slug: "alimentos-e-bebidas",
        imageUrl: "Utensils",
      },
      { name: "Móveis", slug: "moveis", imageUrl: "Sofa" },
      { name: "Joias", slug: "joias", imageUrl: "Gem" },
      { name: "Moda Infantil", slug: "moda-infantil", imageUrl: "Baby" },
      { name: "Moda Masculina", slug: "moda-masculina", imageUrl: "User" },
      { name: "Moda Feminina", slug: "moda-feminina", imageUrl: "UserRound" },
    ],
  });

  console.log("Categorias criadas com sucesso!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
