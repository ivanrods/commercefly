import { BottomNav } from "@/components/bottom-nav";
import { Footer } from "@/components/footer";
import { SiteHeader } from "@/components/site-header";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SiteHeader />
      <main className="max-w-screen-2xl min-h-screen mx-auto px-4 py-8">
        {children}
      </main>
      <Footer />
      <BottomNav />
    </>
  );
}
