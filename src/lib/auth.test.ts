import { requireAdmin } from "./auth";

vi.mock("@clerk/nextjs/server", () => ({
  auth: vi.fn(),
}));

const mockUser = {
  id: "user-1",
  clerkId: "clerk-1",
  email: "admin@test.com",
  role: "ADMIN",
  name: "Admin",
  imageUrl: null,
  phone: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

vi.mock("./prisma", () => ({
  default: {
    user: {
      findUnique: vi.fn(),
    },
  },
}));

import { auth } from "@clerk/nextjs/server";
import prisma from "./prisma";
import { describe, expect, it, vi } from "vitest";

describe("requireAdmin", () => {
  it("throws if not authenticated", async () => {
    vi.mocked(auth).mockResolvedValue({
      userId: null,
      sessionId: null,
      sessionClaims: null,
      actor: null,
      orgId: null,
      orgRole: null,
      orgSlug: null,
      has: vi.fn(),
      getToken: vi.fn(),
    });
    await expect(requireAdmin()).rejects.toThrow("Não autenticado");
  });

  it("throws if user is not ADMIN", async () => {
    vi.mocked(auth).mockResolvedValue({
      userId: "clerk-1",
      sessionId: null,
      sessionClaims: null,
      actor: null,
      orgId: null,
      orgRole: null,
      orgSlug: null,
      has: vi.fn(),
      getToken: vi.fn(),
    });
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      ...mockUser,
      role: "USER",
    });
    await expect(requireAdmin()).rejects.toThrow(
      "Sem permissão de administrador",
    );
  });

  it("returns the admin user", async () => {
    vi.mocked(auth).mockResolvedValue({
      userId: "clerk-1",
      sessionId: null,
      sessionClaims: null,
      actor: null,
      orgId: null,
      orgRole: null,
      orgSlug: null,
      has: vi.fn(),
      getToken: vi.fn(),
    });
    vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser);
    await expect(requireAdmin()).resolves.toEqual(mockUser);
  });
});
