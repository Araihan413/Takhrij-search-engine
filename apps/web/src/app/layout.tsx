import type { Metadata } from "next";
import { IBM_Plex_Sans, IBM_Plex_Sans_Arabic } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";

const ibmPlexSans = IBM_Plex_Sans({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-plex",
});

const ibmPlexArabic = IBM_Plex_Sans_Arabic({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["arabic"],
  variable: "--font-arabic",
});

export const metadata: Metadata = {
  title: "Takhrij | Search Engine Hadith",
  description: "Pencarian Hadis cepat, akurat, dan premium.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${ibmPlexSans.variable} ${ibmPlexArabic.variable}`}>
      <body className="min-h-screen bg-background text-foreground">
        <div className="noise-overlay" />
        <ThemeToggle />
        <main className="relative z-10">{children}</main>
      </body>
    </html>
  );
}
