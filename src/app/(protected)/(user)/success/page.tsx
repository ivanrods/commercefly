import { CheckCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "src/components/ui/button";
import { Card, CardContent } from "src/components/ui/card";

export default function SuccessPage() {
  return (
    <div className="flex  items-center justify-center px-4 mt-24">
      <Card className="w-full max-w-md shadow-2xl rounded-2xl">
        <CardContent className="flex flex-col items-center text-center p-8 space-y-6">
          <div className="flex items-center justify-center w-20 h-20 rounded-full bg-green-100">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>

          <h1 className="text-2xl font-bold text-gray-800">
            Pagamento aprovado
          </h1>

          <p className="text-gray-600">
            Seu pagamento foi processado com sucesso. Agora você já pode
            aproveitar todos os recursos disponíveis.
          </p>

          <div className="flex flex-col gap-3 w-full">
            <Link href="/">
              <Button className="w-full">Ir para o início</Button>
            </Link>

            <Link href="/orders">
              <Button variant="outline" className="w-full">
                Acessar meus pedidos
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
