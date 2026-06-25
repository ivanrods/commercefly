import prisma from "./prisma";
import { describe, expect, it } from "vitest";

describe("prisma", () => {
  it("exports a Prisma client instance", () => {
    expect(prisma).toBeDefined();
    expect(typeof prisma).toBe("object");
    expect(prisma).toHaveProperty("user");
    expect(prisma).toHaveProperty("product");
  });
});
