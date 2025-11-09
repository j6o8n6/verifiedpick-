import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Header } from "@/components/header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "VerifiedPicks",
  description: "A marketplace connecting elite sports handicappers with bettors."
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} min-h-screen bg-slate-950 text-slate-100`}>
        <Providers>
          <div className="gradient-bg min-h-screen">
            <Header />
            <main className="mx-auto min-h-[calc(100vh-5rem)] max-w-6xl px-6 py-10">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
