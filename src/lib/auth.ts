import { auth } from "@clerk/nextjs/server";
import prisma from "./prisma";

export async function requireAdmin() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Não autenticado");
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (!user || user.role !== "ADMIN") {
    throw new Error("Sem permissão de administrador");
  }

  return user;
}
