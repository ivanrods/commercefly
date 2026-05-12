import { defineConfig } from "vitest/config";
import dotenv from "dotenv";

dotenv.config({ path: process.env.NODE_ENV === "test" ? ".env.test" : ".env" });

export default defineConfig({
  test: {
    environment: "node",
    globals: true,
    globalSetup: ["./scripts/vitest-global-setup.ts"],
  },
});
