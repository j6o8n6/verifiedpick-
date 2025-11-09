import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

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
      <body className={`${inter.className} min-h-screen bg-white text-gray-900`}>
        <Providers>
          <div className="flex min-h-screen flex-col bg-white">
            <Header />
            <main className="flex-1 bg-white">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
