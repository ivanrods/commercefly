import { BottomNav } from "src/components/bottom-nav";
import { SiteHeader } from "src/components/site-header";

export default function PublicLayout({
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
