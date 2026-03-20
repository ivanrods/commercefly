import { execSync } from "node:child_process";
import dotenv from "dotenv";

dotenv.config({ path: ".env.test" });

try {
  console.log("Resetando banco de teste...");

  execSync("npx prisma migrate reset --force", {
    stdio: "inherit",
  });

  console.log("Banco de teste pronto");
} catch (error) {
  console.error(error);
  process.exit(1);
}
