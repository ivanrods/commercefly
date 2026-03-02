import { describe, it, expect, afterAll } from "vitest";
import prisma from "../lib/prisma";

describe("Database Connection", () => {
  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("should connect to the database successfully", async () => {
    const result = await prisma.$queryRaw`SELECT 1`;
    expect(result).toBeDefined();
  });
});
