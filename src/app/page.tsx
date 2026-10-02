import { Contact } from "@/components/sections/contact";
import { Experience } from "@/components/sections/experience";
import { Flagship } from "@/components/sections/flagship";
import { Hero } from "@/components/sections/hero";
import { Metrics } from "@/components/sections/metrics";
import { Skills } from "@/components/sections/skills";
import { Work } from "@/components/sections/work";
import { experience, flagship, profile, SITE_URL, skills } from "@/content";

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
      <Hero />
      <Metrics />
      <Flagship />
      <Work />
      <Skills />
      <Experience />
      <Contact />
    </main>
  );
}
