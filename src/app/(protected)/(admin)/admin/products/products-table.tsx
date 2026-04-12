"use client";

import * as React from "react";
import { z } from "zod";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";

import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";

import { Button } from "src/components/ui/button";
import { Checkbox } from "src/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "src/components/ui/dropdown-menu";
import { Input } from "src/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "src/components/ui/table";
import { Badge } from "src/components/ui/badge";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";

export const productSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number(),
  stock: z.number(),
  isFeatured: z.boolean(),
  rating: z.number(),
  ratingCount: z.number(),
  createdAt: z.date(),
  category: z.object({
    name: z.string(),
  }),
  images: z
    .array(
      z.object({
        url: z.string(),
      }),
    )
    .optional(),
});

type Product = z.infer<typeof productSchema>;

type ProductsTableProps = {
  products: Product[];
};

export const columns: ColumnDef<Product>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
      />
    ),
  },
  {
    accessorKey: "images",
    header: "Img",
    cell: ({ row }) => {
      const imageUrl = row.original.images?.[0]?.url;

      return (
        <div className="relative w-10 h-10">
          <Image
            src={imageUrl || "/placeholder.png"}
            alt={row.original.name}
            fill
            className="rounded object-cover"
            sizes="40px"
          />
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    header: "Produto",
    cell: ({ row }) => <div>{row.getValue("name")}</div>,
  },
  {
    accessorKey: "category.name",
    header: "Categoria",
    cell: ({ row }) => <div>{row.original.category.name}</div>,
  },
  {
    accessorKey: "price",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Preço <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const value = row.getValue("price") as number;

      return (
        <div className="font-medium">
          {new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(value)}
        </div>
      );
    },
  },
  {
    accessorKey: "stock",
    header: "Estoque",
    cell: ({ row }) => <Badge variant="outline">{row.getValue("stock")}</Badge>,
  },
  {
    accessorKey: "isFeatured",
    header: "Destaque",
    cell: ({ row }) => (
      <Badge variant={row.getValue("isFeatured") ? "default" : "secondary"}>
        {row.getValue("isFeatured") ? "Sim" : "Não"}
      </Badge>
    ),
  },
  {
    accessorKey: "rating",
    header: "Avaliação",
    cell: ({ row }) => (
      <div>
        ★ {row.original.rating} ({row.original.ratingCount})
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Criado em",
    cell: ({ row }) => {
      const date = row.getValue("createdAt") as Date;
      return date.toLocaleDateString("pt-BR");
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const product = row.original;

      async function handleDelete() {
        const confirmDelete = confirm("Tem certeza que deseja deletar?");
        if (!confirmDelete) return;

        try {
          const res = await fetch(`/api/products/${product.id}`, {
            method: "DELETE",
          });

          const data = await res.json();

          if (!res.ok) {
            alert(data.error);
            return;
          }

          alert("Produto deletado com sucesso");
        } catch (error) {
          console.error(error);
          alert("Erro ao deletar produto");
        }
      }

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Ações</DropdownMenuLabel>

            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(product.id)}
            >
              Copiar ID
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem>
              <Link href={`/admin/products/update/${product.id}`}> Editar</Link>
            </DropdownMenuItem>

            <DropdownMenuItem className="text-red-600" onClick={handleDelete}>
              Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export function ProductsTable({ products }: ProductsTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data: products ?? [],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,

    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),

    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div>
      {/* filtros */}
      <div className="flex items-center py-4 gap-2">
        <Input
          placeholder="Filtrar produto..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(e) =>
            table.getColumn("name")?.setFilterValue(e.target.value)
          }
          className="max-w-sm"
        />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Colunas <ChevronDown />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((col) => col.getCanHide())
              .map((col) => (
                <DropdownMenuCheckboxItem
                  key={col.id}
                  checked={col.getIsVisible()}
                  onCheckedChange={(value) => col.toggleVisibility(!!value)}
                >
                  {col.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* tabela */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length}>
                  Nenhum resultado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* paginação */}
      <div className="flex justify-end gap-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
        >
          Anterior
        </Button>

        <Button variant="outline" size="sm" onClick={() => table.nextPage()}>
          Próxima
        </Button>
      </div>
    </div>
  );
}
