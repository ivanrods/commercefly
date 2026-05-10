import { BottomNav } from "@/components/bottom-nav";
import { SiteHeader } from "@/components/site-header";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SiteHeader />
      <main className="max-w-screen-2xl mx-auto px-4 py-8">{children}</main>
      <BottomNav />
    </>
  );
}
