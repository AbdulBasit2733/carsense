import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";
import ReactQueryProvider from "./provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "CarSense",
  description: "Find Your Dream Car",
};

export default function RootLayout({ children }) {
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
