import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ShoppingBag } from "lucide-react";

export default function NotFound() {
  return (
    <div className="grid min-h-screen w-full">
      <div className="flex flex-col p-8 sm:p-16 justify-center items-center xl:items-start">
        <div className="mb-8 flex items-center gap-2">
          <ShoppingBag />

          <span className="text-xl font-bold">CommerceFly</span>
        </div>

        <div className="flex flex-col items-center text-center xl:items-start xl:text-left">
          <span className="text-sm font-semibold mb-2">404</span>

          <h1 className="text-4xl font-bold mb-2">Página não encontrada</h1>

          <p className="text-muted-foreground max-w-md">
            Ops! A página que você está tentando acessar não existe ou foi
            removida.
          </p>

          <Button asChild className="mt-8">
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="size-4" />
              Voltar para a página inicial
            </Link>
          </Button>
        </div>
      </div>

      <div className="hidden xl:flex items-center justify-center bg-muted">
        <div className="text-center p-8">
          <h2 className="text-6xl font-bold text-muted-foreground/30">404</h2>
        </div>
      </div>
    </div>
  );
}
