"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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

export default function NewProductPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    imageUrl: "",
    stock: 0,
    categoryId: "",
    isFeatured: false,
  });

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      await fetch("/api/products", {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({
          ...form,
          price: Number(form.price) * 100,
          stock: Number(form.stock),
        }),
      });

      alert("Produto criado com sucesso!");
      router.push("/");
    } catch (err) {
      console.error(err);
      alert("Erro ao criar produto");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <FieldSet>
        <FieldLegend>Novo Produto</FieldLegend>
        <FieldDescription>Pagina para adicionar produtos</FieldDescription>
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">Nome do produto</FieldLabel>
              <Input name="name" placeholder="Nome" onChange={handleChange} />
            </Field>
            <Field>
              <FieldLabel htmlFor="description">
                Descrição do produto
              </FieldLabel>
              <Textarea
                name="description"
                placeholder="Descrição"
                onChange={handleChange}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="price">Preço do produto</FieldLabel>
              <Input
                name="price"
                placeholder="ex: 50"
                onChange={handleChange}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="imageUrl">Link da Imagem</FieldLabel>
              <Input
                name="imageUrl"
                placeholder="https://i.ibb.co"
                onChange={handleChange}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="stock">Quantidade disponivel</FieldLabel>
              <Input
                name="stock"
                type="number"
                placeholder="Estoque"
                onChange={handleChange}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="categoryId">Categoria do produto</FieldLabel>
              <Input
                name="categoryId"
                placeholder="Category ID"
                onChange={handleChange}
              />
            </Field>

            <Field orientation="horizontal">
              <Field orientation="horizontal">
                <Checkbox
                  id="isFeatured"
                  checked={form.isFeatured}
                  onCheckedChange={(checked) =>
                    setForm((prev) => ({
                      ...prev,
                      isFeatured: !!checked,
                    }))
                  }
                />
                <FieldLabel htmlFor="isFeatured">
                  Produto em destaque?
                </FieldLabel>
              </Field>
              <FieldLabel htmlFor="terms-checkbox-basic">
                Produto em destaque?
              </FieldLabel>
            </Field>

            <Field orientation="horizontal">
              <Button type="submit">Criar produto</Button>
            </Field>
          </FieldGroup>
        </form>
      </FieldSet>
    </div>
  );
}
