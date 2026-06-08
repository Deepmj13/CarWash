import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import AuthProvider from "@/components/AuthProvider";
import { ToastProvider } from "@/components/Toast";

export const metadata: Metadata = {
  title: "CarWash Finder | Modern Car Care Discovery",
  description: "Find and book the best local car wash shops with a bold and streamlined experience.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-dark-bg text-foreground">
        <AuthProvider>
          <ToastProvider>
            <Navbar />
            {children}
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
