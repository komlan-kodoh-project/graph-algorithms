"use client";
import "./globals.css";
import "./markdown.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <meta name="google-site-verification" content="oUOyOA-PuugSxoQImuXTo5qFPyjBeKE5B8vHWg2epXY" />
      <body className={inter.className}>{children}</body>
    </html>
  );
}
