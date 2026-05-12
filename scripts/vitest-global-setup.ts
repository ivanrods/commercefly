import { execSync } from "node:child_process";
import dotenv from "dotenv";

/**
 * Garante migrate + seed antes de qualquer teste (ex.: `npx vitest run` sem passar por `test-setup.ts`).
 */
export default async function vitestGlobalSetup() {
  dotenv.config({ path: ".env.test" });

  console.log("Resetando banco de teste (vitest globalSetup)...");

  execSync("npx prisma migrate reset --force", {
    stdio: "inherit",
    env: { ...process.env, NODE_ENV: "test" },
  });

  // Prisma v7 não executa seed após `migrate reset`; só via `db seed`.
  execSync("npx prisma db seed", {
    stdio: "inherit",
    env: { ...process.env, NODE_ENV: "test" },
  });

  console.log("Banco de teste pronto");
}
