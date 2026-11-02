import { ThemeProvider } from "@repo/ui/theme-provider";
import { Toaster } from "@repo/ui/toaster";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

// The Geist fonts live in this app (works offline, nothing is downloaded).
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "brainX",
  description: "A chatbot powered by a small language model trained from scratch.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // suppressHydrationWarning: next-themes sets the theme class before React loads.
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ThemeProvider>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
