import { describe, it, expect, vi } from "vitest";
import { requireAdmin } from "./auth";

vi.mock("@clerk/nextjs/server", () => ({ auth: vi.fn() }));

vi.mock("./prisma", () => ({
  default: {
    user: {
      findUnique: vi.fn(),
    },
  },
}));

import { auth } from "@clerk/nextjs/server";
import prisma from "./prisma";
import { Role } from "@/app/generated/prisma/enums";

const mockUser = {
  id: "user-1",
  clerkId: "clerk-1",
  email: "admin@test.com",
  name: "Admin",
  role: Role.ADMIN,
  imageUrl: null as string | null,
  phone: null as string | null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe("requireAdmin", () => {
  it("throws if not authenticated", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: null } as any);
    await expect(requireAdmin()).rejects.toThrow("Não autenticado");
  });

  it("throws if user is not ADMIN", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: "clerk-1" } as any);
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      ...mockUser,
      role: Role.USER,
    });
    await expect(requireAdmin()).rejects.toThrow(
      "Sem permissão de administrador",
    );
  });

  it("returns the admin user", async () => {
    vi.mocked(auth).mockResolvedValue({ userId: "clerk-1" } as any);
    vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser);
    await expect(requireAdmin()).resolves.toEqual(mockUser);
  });
});
