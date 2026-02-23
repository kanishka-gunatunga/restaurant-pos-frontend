import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";
import MinWidthGuard from "@/components/MinWidthGuard";
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
          <AuthProvider>{children}</AuthProvider>
        </MinWidthGuard>
      </body>
    </html>
  );
}
