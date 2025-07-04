import type { Metadata } from "next";
import { Providers } from "@/components/Providers";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import Script from "next/script";

export const metadata: Metadata = {
  title: "ScholarAI",
  description: "Your personal AI-powered study assistant.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap"
          rel="stylesheet"
        ></link>
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&display=swap"
          rel="stylesheet"
        ></link>
        <link
          href="https://fonts.googleapis.com/css2?family=Source+Code+Pro&display=swap"
          rel="stylesheet"
        ></link>
      </head>
      <body className="font-body antialiased">
        <Providers>
          {children}
          <Toaster />
        </Providers>
        <Script src="https://cdn.paddle.com/paddle/v2/paddle.js" />
      </body>
    </html>
  );
}
