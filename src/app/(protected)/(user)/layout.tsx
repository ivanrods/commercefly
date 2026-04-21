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
      <main className="py-16 px-4">{children}</main>
      <BottomNav />
    </>
  );
}
