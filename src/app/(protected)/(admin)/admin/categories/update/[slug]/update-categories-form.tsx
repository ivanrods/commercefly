"use client";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { categorySchema } from "@/validators/category-schema";
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
import { Category } from "@/types/category-type";

interface Props {
  slug: string;
  categories: Category[];
}

type FormData = z.infer<typeof categorySchema>;

export default function UpdateCategoryForm({ slug, categories }: Props) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: categories[0]?.name || "",
      slug: categories[0]?.slug || "",
      imageUrl: categories[0]?.imageUrl || "",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      await fetch(`/api/categories/${slug}`, {
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
