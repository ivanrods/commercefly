import { defineConfig } from "vitest/config";
import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: process.env.NODE_ENV === "test" ? ".env.test" : ".env" });

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    globalSetup: ["./scripts/vitest-global-setup.ts"],
    setupFiles: ["./scripts/vitest-setup.tsx"],
    fileParallelism: false,
  },
});
