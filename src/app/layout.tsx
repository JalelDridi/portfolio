import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { profile, SITE_URL } from "@/content";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const description =
  "Founding engineer working in full-stack TypeScript on payments and reliability. Case studies and Payout Ledger, an open-source payout monitor with a live demo.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: `${profile.name} · Founding Engineer, Full-Stack TypeScript`,
  description,
  alternates: { canonical: "/" },
  openGraph: {
    title: profile.name,
    description,
    url: "/",
    siteName: profile.name,
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body>{children}</body>
    </html>
  );
}
