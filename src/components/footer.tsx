import { ShoppingBag } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

export function Footer() {
  return (
    <footer className="w-full border-t  px-6 py-20 md:py-16 ">
      <div className="mx-auto grid grid-cols-1 max-w-screen-2xl gap-12 lg:grid-cols-2 ">
        <div className="space-y-4 ">
          <div className="flex items-center gap-2 font-semibold text-lg">
            <ShoppingBag className="h-5 w-5" />
            CommerceFly
          </div>

          <p className="text-sm text-muted-foreground">
            Explore nossa coleção exclusiva de produtos. Cada peça é escolhida a
            dedo para quem aprecia qualidade e estilo.
          </p>

          <div className="flex gap-2">
            <Input placeholder="Email address" />
            <Button className="flex items-center gap-2">Inscreva-se →</Button>
          </div>
        </div>
        <div className="w-full flex flex-col md:flex-row justify-between gap-8">
          <div>
            <h3 className="mb-3 font-medium">Início</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="https://portfolio-ivan-rodrigues.vercel.app/">Sobre</a>
              </li>
              <li>
                <a href="https://portfolio-ivan-rodrigues.vercel.app/">
                  Coleção
                </a>
              </li>
              <li>
                <a href="https://portfolio-ivan-rodrigues.vercel.app/">
                  Blog e Notícias
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 font-medium">Segurança</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="https://portfolio-ivan-rodrigues.vercel.app/">
                  Política de Privacidade
                </a>
              </li>
              <li>
                <a href="https://portfolio-ivan-rodrigues.vercel.app/">
                  Acordos de Usuário
                </a>
              </li>
              <li>
                <a href="https://portfolio-ivan-rodrigues.vercel.app/">
                  Copyright
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 font-medium">Social Media</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="https://www.linkedin.com/in/ivanrods/  ">Linkedin</a>
              </li>
              <li>
                <a href="https://github.com/ivanrods">Github</a>
              </li>
              <li>
                <a href="https://portfolio-ivan-rodrigues.vercel.app/">
                  Portfólio
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
