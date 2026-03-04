import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";
import MinWidthGuard from "@/components/MinWidthGuard";
import QueryProvider from "@/utils/providers";
import * as Auth from "@/contexts/AuthContext";
import { SessionProvider } from "@/components/providers/SessionProvider";

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
            <QueryProvider>
              <Auth.AuthProvider>{children}</Auth.AuthProvider>
            </QueryProvider>
          </SessionProvider>
        </MinWidthGuard>
      </body>
    </html>
  );
}
