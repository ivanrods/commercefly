"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { productFormSchema } from "@/validators/product-schema";
import { zodResolver } from "@hookform/resolvers/zod";

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
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { Category } from "@/types/category-type";
import { toast } from "sonner";
import { Product } from "@/types/product-type";

interface Props {
  id: string;
  product: Product;
  categories: Category[];
}

type FormData = z.infer<typeof productFormSchema>;

export default function UpdateProductForm({ id, product, categories }: Props) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: product.name,
      description: product.description,
      price: product.price,
      images: product.images.map((img) => img.url),
      stock: product.stock,
      categoryId: product.categoryId,
      isFeatured: product.isFeatured,
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      await fetch(`/api/products/${id}`, {
        method: "PUT",
        credentials: "include",
        body: JSON.stringify(data),
      });

      toast.success("Produto atualizado com sucesso!", {
        position: "top-center",
      });
      router.push("/admin/products");
    } catch (err) {
      console.error(err);
      toast.error("Erro ao atualizar produto", {
        position: "top-center",
      });
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
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
              <Input {...register("price", { valueAsNumber: true })} />
              <p className="text-red-500 text-sm">{errors.price?.message}</p>
            </Field>

            <Field>
              <FieldLabel>Imagem</FieldLabel>
              <Input onChange={(e) => setValue("images", [e.target.value])} />
              <p className="text-red-500 text-sm">{errors.images?.message}</p>
            </Field>

            <Field>
              <FieldLabel>Estoque</FieldLabel>
              <Input
                type="number"
                {...register("stock", { valueAsNumber: true })}
              />
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
