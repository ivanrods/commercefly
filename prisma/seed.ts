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

  const categories = await prisma.category.findMany();

  const getCategoryId = (slug: string) => {
    const category = categories.find((c) => c.slug === slug);
    if (!category) throw new Error(`Categoria ${slug} não encontrada`);
    return category.id;
  };

  const products = [
    {
      name: "Tênis Nike Air",
      description:
        "Tênis leve e confortável, ideal para corridas e caminhadas diárias, com ótima absorção de impacto e design moderno que combina com diversos estilos",
      price: 349,
      stock: 20,
      categorySlug: "calcados",
      images: [
        "https://i.ibb.co/nsN4kQLL/nike.png",
        "https://i.ibb.co/8qvb9rz/tenis-font-removebg-preview.png",
        "https://i.ibb.co/FjTdss1/tenist-duo-removebg-preview.png",
        "https://i.ibb.co/LXhKKPGn/tenis-back-removebg-preview.png",
      ],
    },
    {
      name: "Bota de Couro",
      description:
        "Bota de couro resistente, perfeita para uso casual ou em dias frios, oferecendo durabilidade, conforto prolongado e um visual elegante para qualquer ocasião",
      price: 259,
      stock: 12,
      categorySlug: "calcados",
      images: ["https://i.ibb.co/k2pV9Rpv/bota.png"],
    },
    {
      name: "Kit Maquiagem Completo",
      description:
        "Kit completo com diversos itens essenciais de maquiagem, ideal para uso diário ou profissional, proporcionando praticidade, variedade e excelente custo-benefício",
      price: 189,
      stock: 30,
      categorySlug: "beleza-e-cosmeticos",
      images: ["https://i.ibb.co/rGjb7v3N/make.png"],
    },
    {
      name: "Perfume Floral",
      description:
        "Perfume com fragrância floral suave e marcante, ideal para uso diário ou ocasiões especiais, oferecendo longa duração e sensação de frescor ao longo do dia",
      price: 129,
      stock: 25,
      categorySlug: "beleza-e-cosmeticos",
      images: ["https://i.ibb.co/k2vtCz8Z/prfume.png"],
    },
    {
      name: "Notebook Dell i5",
      description:
        "Notebook com processador i5, ideal para estudos, trabalho e tarefas do dia a dia, oferecendo bom desempenho, rapidez e eficiência em múltiplas aplicações",
      price: 3899,
      stock: 8,
      categorySlug: "informatica",
      images: ["https://i.ibb.co/93zSCMTh/notebook.png"],
    },
    {
      name: "Mouse Gamer RGB",
      description:
        "Mouse gamer com alta precisão e iluminação RGB personalizável, ideal para jogos e uso prolongado, garantindo conforto, desempenho e estilo ao setup",
      price: 99,
      stock: 50,
      categorySlug: "informatica",
      images: ["https://i.ibb.co/JWgKGXvv/mouse.png"],
    },
    {
      name: "Sofá 3 Lugares",
      description:
        "Sofá espaçoso de 3 lugares, confortável e ideal para salas modernas, oferecendo excelente apoio, durabilidade e um design que valoriza o ambiente",
      price: 1299,
      stock: 5,
      categorySlug: "moveis",
      images: ["https://i.ibb.co/zhxT8f7C/sofa.png"],
    },
    {
      name: "Guarda-Roupa Casal",
      description:
        "Guarda-roupa amplo para casal, com diversas divisórias internas, ideal para organização eficiente de roupas e acessórios, unindo praticidade e estilo",
      price: 899,
      stock: 7,
      categorySlug: "moveis",
      images: ["https://i.ibb.co/zVpGLNFJ/guarda-roupa.png"],
    },
    {
      name: "Camiseta Infantil",
      description:
        "Camiseta infantil feita com tecido macio e confortável, ideal para uso diário, garantindo liberdade de movimento e resistência para atividades das crianças",
      price: 49,
      stock: 40,
      categorySlug: "moda-infantil",
      images: ["https://i.ibb.co/4nGhrVQ0/infantil.png"],
    },
    {
      name: "Vestido Feminino preto",
      description:
        "Vestido feminino com estampa preto delicada, tecido leve e confortável, ideal para dias quentes e ocasiões casuais, trazendo elegância e estilo",
      price: 119,
      stock: 18,
      categorySlug: "moda-feminina",
      images: ["https://i.ibb.co/Q3GXV1mC/vesdo.png"],
    },
    {
      name: "Camisa manga curta",
      description:
        "Camisa social masculina manga curta cinza confortalvel e elegante para usar no dia e em ocasiões especiais. ",
      price: 69,
      stock: 20,
      categorySlug: "moda-masculina",
      images: ["https://i.ibb.co/fYFqBXn8/camisam.webp"],
    },

    {
      name: "Anel de noivado Tiffany",
      description:
        "Anel Solitário 1895, ouro amarelo 18K | Esse lindo anéil cravejados combinam a beleza de um anel de noivado com a grandiosidade de uma aliança de casamento.",
      price: 519,
      stock: 8,
      categorySlug: "joias",
      images: ["https://i.ibb.co/jZbhN68R/anel.webp"],
    },
  ];

  await Promise.all(
    products.map((product) =>
      prisma.product.create({
        data: {
          name: product.name,
          description: product.description,
          price: product.price,
          stock: product.stock,
          categoryId: getCategoryId(product.categorySlug),
          images: {
            create: product.images.map((url) => ({ url })),
          },
        },
      }),
    ),
  );

  console.log("Seed executado com sucesso!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (err) => {
    console.error(err);
    await prisma.$disconnect();
    process.exit(1);
  });
