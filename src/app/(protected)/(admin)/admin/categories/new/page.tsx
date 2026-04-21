"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Button } from "@/components/ui/button";

const categorySchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  slug: z.string().min(1, "Slug é obrigatório"),
  imageUrl: z.string().optional().or(z.literal("")),
});

type FormData = z.infer<typeof categorySchema>;

export default function NewCategoryPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      slug: "",
      imageUrl: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      await fetch("/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          imageUrl: data.imageUrl || null,
        }),
      });

      toast.success("Categoria criada com sucesso!", {
        position: "top-center",
      });
      router.push("/admin/categories");
    } catch (err) {
      console.error(err);
      toast.error("Erro ao criar categoria", {
        position: "top-center",
      });
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <FieldSet>
        <FieldLegend>Nova Categoria</FieldLegend>
        <FieldDescription>Página para adicionar categorias</FieldDescription>

        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <Field>
              <FieldLabel>Nome da categoria</FieldLabel>
              <Input {...register("name")} placeholder="Ex: Eletrônicos" />
              <p className="text-red-500 text-sm">{errors.name?.message}</p>
            </Field>

            <Field>
              <FieldLabel>Slug</FieldLabel>
              <Input {...register("slug")} placeholder="ex: eletronicos" />
              <p className="text-red-500 text-sm">{errors.slug?.message}</p>
            </Field>

            <Field>
              <FieldLabel>Imagem (opcional)</FieldLabel>
              <Input {...register("imageUrl")} placeholder="https://..." />
              <p className="text-red-500 text-sm">{errors.imageUrl?.message}</p>
            </Field>

            <Field orientation="horizontal">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Criando..." : "Criar categoria"}
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </FieldSet>
    </div>
  );
}
