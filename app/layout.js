import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";
import ReactQueryProvider from "./provider";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "CarSense",
  description: "Find Your Dream Car",
};

export default function RootLayout({ children }) {
  const isAdminPage = false;
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <ReactQueryProvider>
            <Header isAdminPage={false} />
            <main>{children}</main>
            {isAdminPage === false && <Footer />}
            <Toaster richColors />
          </ReactQueryProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
