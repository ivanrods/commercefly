import prisma from "src/lib/prisma";
import { UsersTable } from "./users-table";

export default async function Page() {
  const users = await prisma.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });
  return (
    <div className="w-full p-4">
      <UsersTable users={users} />
    </div>
  );
}
