import { execSync } from "node:child_process";

process.env.NODE_ENV = "test";

try {
  console.log("Resetando banco de teste...");

  execSync("npx prisma migrate reset --force", {
    stdio: "inherit",
  });

  console.log("Banco pronto para testes");
} catch (error) {
  console.error(error);
  process.exit(1);
}
