import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { clerkClient } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";
import prisma from "../../../../lib/prisma";

const ADMIN_EMAIL = "contaivanrodrigues@gmail.com";

export async function POST(req: NextRequest) {
  try {
    const evt = await verifyWebhook(req);
    const eventType = evt.type;

    console.log(
      `Received webhook with ID ${evt.data.id} and event type ${eventType}`,
    );

    if (eventType === "user.created") {
      const { id, email_addresses, first_name, last_name } = evt.data;

      const email = email_addresses[0]?.email_address ?? "";
      const name = `${first_name ?? ""} ${last_name ?? ""}`.trim();

      const isAdmin = email === ADMIN_EMAIL;

      const role = isAdmin ? "ADMIN" : "USER";

      await prisma.user.upsert({
        where: { clerkId: id },
        update: {},
        create: {
          clerkId: id,
          email,
          name,
          role,
        },
      });

      await (
        await clerkClient()
      ).users.updateUserMetadata(id, {
        publicMetadata: {
          role: "ADMIN",
        },
      });
    }

    if (eventType === "user.updated") {
      const { id, email_addresses, first_name, last_name } = evt.data;

      const email = email_addresses[0]?.email_address ?? "";
      const name = `${first_name ?? ""} ${last_name ?? ""}`.trim();

      const isAdmin = email === ADMIN_EMAIL;
      const role = isAdmin ? "ADMIN" : "USER";

      await prisma.user.upsert({
        where: { clerkId: id },
        update: {
          email,
          name,
          role,
        },
        create: {
          clerkId: id,
          email,
          name,
          role,
        },
      });

      await (
        await clerkClient()
      ).users.updateUserMetadata(id, {
        publicMetadata: {
          role,
        },
      });
    }

    if (eventType === "user.deleted") {
      const { id } = evt.data;

      await prisma.user.deleteMany({
        where: { clerkId: id },
      });
    }

    return new Response("Webhook received", { status: 200 });
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error verifying webhook", { status: 400 });
  }
}
