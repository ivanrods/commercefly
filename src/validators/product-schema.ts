import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  description: z.string().min(5, "Descrição muito curta"),
  price: z.number().int().positive("Preço deve ser maior que 0"),
  images: z
    .array(z.string().url("URL inválida"))
    .min(1, "Adicione pelo menos uma imagem"),
  stock: z.number().int().min(0, "Estoque não pode ser negativo"),
  isFeatured: z.boolean().optional().default(false),
  categoryId: z.string().min(1, "Selecione uma categoria"), // uuid no backend, min(1) no frontend
});


// Versão para uso nos formulários do front-end
export const productFormSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().min(1, "Descrição é obrigatória"),
  price: z.number().min(1, "Preço inválido"),
  images: z.array(z.string().url("URL inválida")).min(1, "Adicione uma imagem"),
  stock: z.number().min(0),
  categoryId: z.string().min(1, "Selecione uma categoria"),
  isFeatured: z.boolean(),
});

export type ProductSchema = typeof productSchema;
