import type { Metadata } from "next";
import { Alexandria, DM_Mono, Onest, Reem_Kufi } from "next/font/google";
import { Providers } from "@/components/providers";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { profile, SITE_URL } from "@/content";
import "./globals.css";

const alexandria = Alexandria({
  subsets: ["latin"],
  weight: ["500", "700", "800", "900"],
  variable: "--font-alexandria",
});

const onest = Onest({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-onest",
});

// Only labels, dates and numbers use the mono face, so it is not worth a preload.
const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-dm-mono",
  preload: false,
});

// A few Arabic words, each beside its meaning; not worth a preload either.
const reemKufi = Reem_Kufi({
  subsets: ["arabic"],
  weight: ["500", "700"],
  variable: "--font-reem-kufi",
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
      className={`${alexandria.variable} ${onest.variable} ${dmMono.variable} ${reemKufi.variable}`}
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
