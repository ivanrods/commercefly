import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "../components/site-header";
import { ReactQueryProvider } from "src/providers/react-query-provider";
import { BottomNav } from "src/components/bottom-nav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CommerceFly",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <ReactQueryProvider>
        <html lang="pt-BR">
          <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
          >
            <SiteHeader />
            {children}
            <BottomNav />
          </body>
        </html>
      </ReactQueryProvider>
    </ClerkProvider>
  );
}
