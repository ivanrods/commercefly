"use client";
import { MoreHorizontalIcon } from "lucide-react";
import Link from "next/link";

import { Button } from "src/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "src/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "src/components/ui/table";
import { Category } from "src/types/category-type";
type CategoriesTableProps = {
  categories: Category[];
};

export function CategoriesTable({ categories }: CategoriesTableProps) {
  async function handleDelete(slug: string) {
    const confirmDelete = confirm("Tem certeza que deseja deletar?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/categories/${slug}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error);
        return;
      }

      alert("Categoria deletada com sucesso");
    } catch (error) {
      console.error(error);
      alert("Erro ao deletar categoria");
    }
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Slug</TableHead>
          <TableHead>Imagem</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {categories.map((category) => (
          <TableRow key={category.id}>
            <TableCell className="font-medium">{category.name}</TableCell>

            <TableCell>{category.slug}</TableCell>

            <TableCell>{category.imageUrl}</TableCell>

            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="size-8">
                    <MoreHorizontalIcon />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Link href={`/admin/categories/update/${category.slug}`}>
                      Editar
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={() => handleDelete(category.slug)}
                  >
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
