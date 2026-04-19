import { BottomNav } from "src/components/bottom-nav";
import { Footer } from "src/components/footer";
import { SiteHeader } from "src/components/site-header";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SiteHeader />
      <main className="max-w-screen-2xl mx-auto px-4 py-8">{children}</main>
      <Footer />
      <BottomNav />
    </>
  );
}
