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
import { ImageUploadField } from "@/components/image-upload-field";
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

type FormData = z.infer<typeof productFormSchema>;

export default function NewProductForm({
  categories,
}: {
  categories: Category[];
}) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      images: [],
      stock: 0,
      categoryId: "",
      isFeatured: false,
    },
  });

  // Watch images para atualizar em tempo real
  // eslint-disable-next-line react-hooks/incompatible-library
  const images = watch("images");

  const onSubmit = async (data: FormData) => {
    try {
      // Filtrar URLs vazias
      const validImages = data.images.filter((url) => url.trim().length > 0);

      if (validImages.length === 0) {
        toast.error("Adicione pelo menos uma imagem", {
          position: "top-center",
        });
        return;
      }

      await fetch("/api/products", {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({
          ...data,
          images: validImages,
          price: data.price,
        }),
      });

      toast.success("Produto criado com sucesso!", {
        position: "top-center",
      });
      router.push("/admin/products");
    } catch (err) {
      console.error(err);
      toast.error("Erro ao criar produto", {
        position: "top-center",
      });
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4 ">
      <FieldSet>
        <FieldLegend>Novo Produto</FieldLegend>
        <FieldDescription>Pagina para adicionar produtos</FieldDescription>

        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <Field>
              <FieldLabel>Nome do produto</FieldLabel>
              <Input {...register("name")} placeholder="Nome" />
              <p className="text-red-500 text-sm">{errors.name?.message}</p>
            </Field>

            <Field>
              <FieldLabel>Descrição do produto</FieldLabel>
              <Textarea {...register("description")} placeholder="Descrição" />
              <p className="text-red-500 text-sm">
                {errors.description?.message}
              </p>
            </Field>

            <Field>
              <FieldLabel>Preço do produto</FieldLabel>
              <Input
                {...register("price", { valueAsNumber: true })}
                placeholder="ex: 50 ou 50,99"
              />
              <p className="text-red-500 text-sm">{errors.price?.message}</p>
            </Field>

            <ImageUploadField
              value={images || []}
              onChange={(images) => setValue("images", images)}
              error={errors.images?.message}
              label="Imagens do Produto"
              maxImages={5}
            />

            <Field>
              <FieldLabel>Quantidade disponível</FieldLabel>
              <Input
                type="number"
                {...register("stock", { valueAsNumber: true })}
                placeholder="Estoque"
              />
            </Field>

            <Field>
              <FieldLabel>Categoria do produto</FieldLabel>

              <Combobox
                items={categories}
                onValueChange={(value) =>
                  setValue("categoryId", value as string)
                }
              >
                <ComboboxInput placeholder="Selecione uma categoria" />

                <ComboboxContent>
                  <ComboboxEmpty>Nenhuma categoria encontrada.</ComboboxEmpty>

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

            <Field orientation="horizontal">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Criando..." : "Criar produto"}
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </FieldSet>
    </div>
  );
}
