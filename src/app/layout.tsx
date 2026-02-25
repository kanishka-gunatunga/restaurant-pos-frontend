import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/contexts/AuthContext";
import "./globals.css";
import MinWidthGuard from "@/components/MinWidthGuard";
import { SessionProvider } from "@/components/providers/SessionProvider";
import { AuthProvider } from "@/contexts/AuthContext";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Restaurant POS",
  description: "Point of Sale system for restaurant operations",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistMono.variable} antialiased`}>
        <MinWidthGuard>
          <SessionProvider>
            <AuthProvider>{children}</AuthProvider>
          </SessionProvider>
        </MinWidthGuard>
      </body>
    </html>
  );
}
