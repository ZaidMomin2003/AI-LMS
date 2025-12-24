import type { Metadata } from "next";
import { Providers } from "@/components/Providers";
import "./globals.css";
import 'katex/dist/katex.min.css';
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/ThemeProvider";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";

export const metadata: Metadata = {
  title: "Wisdom is Fun - Your Personal AI Study Buddy",
  description: "Master any subject instantly with Wisdom is Fun, the AI-powered learning platform. Generate detailed notes, interactive flashcards, and quizzes to accelerate your learning and ace your exams.",
  keywords: "AI learning, study tools, education, students, flashcards, quizzes, notes, exam prep, learning platform, wisdom is fun",
  authors: [{ name: "Wisdom is Fun" }],
  creator: "Wisdom is Fun",
  publisher: "Wisdom is Fun",
  metadataBase: new URL('https://wisdomis.fun'),
  openGraph: {
    title: "Wisdom is Fun - Your Personal AI Study Buddy",
    description: "Master any subject instantly with AI-powered notes, flashcards, and quizzes.",
    url: "https://wisdomis.fun",
    siteName: "Wisdom is Fun",
    images: [
      {
        url: "/og-image.png", // Must be an absolute URL
        width: 1200,
        height: 630,
        alt: "Wisdom is Fun - AI Learning Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Wisdom is Fun - Your Personal AI Study Buddy",
    description: "Master any subject instantly with AI-powered notes, flashcards, and quizzes.",
    images: ["/og-image.png"], // Must be an absolute URL
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
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
        <GoogleAnalytics />
      </head>
      <body className="font-body antialiased">
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
          <Providers>
            {children}
            <Toaster />
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
