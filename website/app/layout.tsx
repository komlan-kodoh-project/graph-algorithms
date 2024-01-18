"use client";
import "./globals.css";
import { Inter } from "next/font/google";
import useWebAssembly from "@/utils/useWebAssembly";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useWebAssembly();

  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
