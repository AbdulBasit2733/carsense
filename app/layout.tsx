import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";
import ReactQueryProvider from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CarSense",
  description: "Find Your Dream Car",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <ReactQueryProvider>
            <Header isAdminPage={false} />
            <main>{children}</main>
            <Toaster richColors />
            <Footer />
          </ReactQueryProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
