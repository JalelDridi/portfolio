import Link from "next/link";
import { Reel } from "@/components/episodes/reel";
import {
  earlierEpisodes,
  episodes,
  experience,
  flagship,
  profile,
  SITE_URL,
  skills,
  ui,
} from "@/content";

// Tells search engines who this page is about, in their own vocabulary.
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  mainEntity: {
    "@type": "Person",
    name: profile.name,
    alternateName: profile.shortName,
    jobTitle: profile.role,
    description: profile.intro,
    url: SITE_URL,
    email: `mailto:${profile.links.email}`,
    sameAs: [profile.links.github, profile.links.linkedin, flagship.repo],
    worksFor: {
      "@type": "Organization",
      name: experience[0].company,
      url: experience[0].href,
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Bizerte",
      addressCountry: "TN",
    },
    alumniOf: { "@type": "CollegeOrUniversity", name: "ESPRIT" },
    knowsLanguage: ["en", "fr", "ar"],
    knowsAbout: skills.flatMap((group) => group.items),
  },
};

export default function Home() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <Reel episodes={episodes} />
      {/* Older work, quietly, under the reel. */}
      <section
        aria-labelledby="earlier"
        className="px-4 pt-14 pb-20 font-mono sm:px-11"
      >
        <h2
          id="earlier"
          className="text-[0.8rem] tracking-[0.08em] text-muted-foreground uppercase"
        >
          {ui.earlier}
        </h2>
        <ul className="mt-4 max-w-3xl border-t border-border">
          {earlierEpisodes.map((episode) => (
            <li key={episode.href} className="border-b border-border">
              <Link
                href={episode.href}
                className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-3 text-[0.85rem] text-muted-foreground transition-colors hover:text-foreground"
              >
                <span>{episode.file}</span>
                <span className="text-foreground">{episode.title}</span>
                <span className="tabular-nums">{episode.year}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
