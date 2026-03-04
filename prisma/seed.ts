import prisma from "../src/lib/prisma";

async function main() {
  await prisma.category.createMany({
    data: [
      { name: "Calçados", slug: "calcados" },
      { name: "Beleza e Cosméticos", slug: "beleza-e-cosmeticos" },
      { name: "Esportes e Lazer", slug: "esportes-e-lazer" },
      { name: "Casa e Decoração", slug: "casa-e-decoracao" },
      { name: "Informática", slug: "informatica" },
      { name: "Brinquedos", slug: "brinquedos" },
      { name: "Ferramentas", slug: "ferramentas" },
      { name: "Pet Shop", slug: "pet-shop" },
      { name: "Saúde", slug: "saude" },
      { name: "Alimentos e Bebidas", slug: "alimentos-e-bebidas" },
      { name: "Móveis", slug: "moveis" },
      { name: "Joias", slug: "joias" },
      { name: "Moda Infantil", slug: "moda-infantil" },
      { name: "Moda Masculina", slug: "moda-masculina" },
      { name: "Moda Feminina", slug: "moda-feminina" },
    ],
  });

  console.log("Categorias criadas com sucesso!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
