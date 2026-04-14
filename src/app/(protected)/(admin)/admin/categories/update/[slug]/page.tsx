"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Input } from "src/components/ui/input";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "src/components/ui/field";
import { Button } from "src/components/ui/button";

const categorySchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  slug: z.string().min(1, "Slug é obrigatório"),
  imageUrl: z.string().optional().or(z.literal("")),
});

type FormData = z.infer<typeof categorySchema>;

export default function UpdateCategoryPage() {
  const router = useRouter();
  const params = useParams();

  const currentSlug = params.slug as string;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(categorySchema),
  });

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await fetch(`/api/categories/${currentSlug}`);
        const data = await res.json();

        setValue("name", data.name);
        setValue("slug", data.slug);
        setValue("imageUrl", data.imageUrl || "");
      } catch (err) {
        console.error(err);
        toast.error("Erro ao carregar categoria", {
          position: "top-center",
        });
      }
    };

    if (currentSlug) {
      fetchCategory();
    }
  }, [currentSlug, setValue]);

  const onSubmit = async (data: FormData) => {
    try {
      await fetch(`/api/categories/${currentSlug}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          newSlug: data.slug,
          imageUrl: data.imageUrl || null,
        }),
      });

      toast.success("Categoria atualizada com sucesso!", {
        position: "top-center",
      });
      router.push("/admin/categories");
    } catch (err) {
      console.error(err);
      toast.error("Erro ao atualizar categoria", {
        position: "top-center",
      });
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <FieldSet>
        <FieldLegend>Editar Categoria</FieldLegend>
        <FieldDescription>Atualize os dados da categoria</FieldDescription>

        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <Field>
              <FieldLabel>Nome da categoria</FieldLabel>
              <Input {...register("name")} />
              <p className="text-red-500 text-sm">{errors.name?.message}</p>
            </Field>

            <Field>
              <FieldLabel>Slug</FieldLabel>
              <Input {...register("slug")} />
              <p className="text-red-500 text-sm">{errors.slug?.message}</p>
            </Field>

            <Field>
              <FieldLabel>Imagem (opcional)</FieldLabel>
              <Input {...register("imageUrl")} />
              <p className="text-red-500 text-sm">{errors.imageUrl?.message}</p>
            </Field>

            <Field orientation="horizontal">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Salvando..." : "Salvar alterações"}
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </FieldSet>
    </div>
  );
}
