import type { Metadata } from "next";
import {
  Bricolage_Grotesque,
  IBM_Plex_Mono,
  IBM_Plex_Sans,
} from "next/font/google";
import { Providers } from "@/components/providers";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { profile, SITE_URL } from "@/content";
import "./globals.css";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  axes: ["opsz", "wdth"],
  variable: "--font-display",
});

const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-sans",
});

// Only labels, dates and numbers use the mono face, so it is not worth a preload.
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  preload: false,
});

const description =
  "Founding engineer working in full-stack TypeScript on payments and reliability. Case studies and Payout Ledger, an open-source payout monitor with a live demo.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${profile.name} · Founding Engineer, Full-Stack TypeScript`,
    template: `%s · ${profile.name}`,
  },
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
    // next-themes sets the theme class on <html> before hydration.
    <html
      lang="en"
      suppressHydrationWarning
      className={`${display.variable} ${plexSans.variable} ${plexMono.variable}`}
    >
      <body>
        <Providers>
          <a
            href="#content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:rounded-md focus:bg-foreground focus:px-4 focus:py-2 focus:text-background"
          >
            Skip to content
          </a>
          <SiteHeader />
          <div id="content">{children}</div>
          <SiteFooter />
        </Providers>
      </body>
    </html>
  );
}
