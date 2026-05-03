import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./admin/components/app-sidebar";
import { AppHeader } from "./admin/components/app-header";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full h-screen overflow-auto">
        <AppHeader />
        {children}
      </main>
    </SidebarProvider>
  );
}
