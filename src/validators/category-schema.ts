// Centralized Zod schema for Category
import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  slug: z.string().min(1, "Slug é obrigatório"),
  imageUrl: z.string().optional().or(z.literal("")),
});

export type CategorySchema = z.infer<typeof categorySchema>;
