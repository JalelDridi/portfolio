import type { Metadata } from "next";
import { Archivo, IBM_Plex_Mono, Onest } from "next/font/google";
import { Providers } from "@/components/providers";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { profile, SITE_URL } from "@/content";
import "./globals.css";

// Titles: the variable font with its width axis, so it can be set at 125%.
const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
});

// Labels, the header and the home page.
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-mono",
});

// Long case-study text.
const onest = Onest({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-onest",
});

// Evaluated when the page is built, so it is the date of the deploy.
const LAST_DEPLOY = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
}).format(new Date());

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
    <html
      lang="en"
      className={`${archivo.variable} ${plexMono.variable} ${onest.variable}`}
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
          <SiteFooter lastDeploy={LAST_DEPLOY} />
        </Providers>
      </body>
    </html>
  );
}
