"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

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
import { Textarea } from "src/components/ui/textarea";
import { Checkbox } from "src/components/ui/checkbox";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "src/components/ui/combobox";

const productSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().min(1, "Descrição é obrigatória"),
  price: z.coerce.number().min(1, "Preço inválido"),
  images: z.array(z.string().url("URL inválida")).min(1),
  stock: z.coerce.number().min(0),
  categoryId: z.string().min(1, "Selecione uma categoria"),
  isFeatured: z.boolean(),
});

type FormData = z.infer<typeof productSchema>;

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      images: [""],
      stock: 0,
      categoryId: "",
      isFeatured: false,
    },
  });

  useEffect(() => {
    async function loadCategories() {
      const res = await fetch("/api/categories");
      const data = await res.json();
      setCategories(data);
    }

    loadCategories();
  }, []);

  useEffect(() => {
    async function loadProduct() {
      try {
        const res = await fetch(`/api/products/${id}`);
        const product = await res.json();

        setValue("name", product.name);
        setValue("description", product.description);
        setValue("price", product.price);
        setValue(
          "images",
          product.images.map((img: any) => img.url),
        );
        setValue("stock", product.stock);
        setValue("categoryId", product.categoryId);
        setValue("isFeatured", product.isFeatured);
      } catch (err) {
        console.error(err);
        alert("Erro ao carregar produto");
      } finally {
        setLoading(false);
      }
    }

    if (id) loadProduct();
  }, [id, setValue]);

  const onSubmit = async (data: FormData) => {
    try {
      await fetch(`/api/products/${id}`, {
        method: "PUT",
        credentials: "include",
        body: JSON.stringify(data),
      });

      alert("Produto atualizado com sucesso!");
      router.push("/admin/products");
    } catch (err) {
      console.error(err);
      alert("Erro ao atualizar produto");
    }
  };

  if (loading) return <p>Carregando...</p>;

  return (
    <div className="max-w-xl mx-auto px-4">
      <FieldSet>
        <FieldLegend>Editar Produto</FieldLegend>
        <FieldDescription>Atualize os dados do produto</FieldDescription>

        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <Field>
              <FieldLabel>Nome do produto</FieldLabel>
              <Input {...register("name")} />
              <p className="text-red-500 text-sm">{errors.name?.message}</p>
            </Field>

            <Field>
              <FieldLabel>Descrição</FieldLabel>
              <Textarea {...register("description")} />
              <p className="text-red-500 text-sm">
                {errors.description?.message}
              </p>
            </Field>

            <Field>
              <FieldLabel>Preço</FieldLabel>
              <Input {...register("price")} />
              <p className="text-red-500 text-sm">{errors.price?.message}</p>
            </Field>

            <Field>
              <FieldLabel>Imagem</FieldLabel>
              <Input onChange={(e) => setValue("images", [e.target.value])} />
              <p className="text-red-500 text-sm">{errors.images?.message}</p>
            </Field>

            <Field>
              <FieldLabel>Estoque</FieldLabel>
              <Input type="number" {...register("stock")} />
            </Field>

            <Field>
              <FieldLabel>Categoria</FieldLabel>

              <Combobox
                items={categories}
                onValueChange={(value) =>
                  setValue("categoryId", value as string)
                }
              >
                <ComboboxInput placeholder="Selecione uma categoria" />

                <ComboboxContent>
                  <ComboboxEmpty>Nenhuma categoria encontrada</ComboboxEmpty>

                  <ComboboxList>
                    {(item) => (
                      <ComboboxItem key={item.id} value={item.id}>
                        {item.name}
                      </ComboboxItem>
                    )}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>

              <p className="text-red-500 text-sm">
                {errors.categoryId?.message}
              </p>
            </Field>

            <Field orientation="horizontal">
              <Checkbox
                onCheckedChange={(checked) => setValue("isFeatured", !!checked)}
              />
              <FieldLabel>Produto em destaque?</FieldLabel>
            </Field>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Atualizando..." : "Atualizar produto"}
            </Button>
          </FieldGroup>
        </form>
      </FieldSet>
    </div>
  );
}
