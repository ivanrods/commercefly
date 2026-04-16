import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  "/cart(.*)",
  "/checkout(.*)",
  "/profile(.*)",
  "/orders(.*)",
  "/admin(.*)",
  "/api/cart(.*)",
]);

const isAdminRoute = createRouteMatcher(["/admin(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
  if (isAdminRoute(req)) {
    const { sessionClaims } = await auth();

    const role = (sessionClaims?.publicMetadata as any)?.role;

    if (role !== "ADMIN") {
      return new Response("Sem permissão", { status: 403 });
    }
  }
});
