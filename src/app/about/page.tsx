import type { Metadata } from "next";
import { About } from "@/components/sections/about";
import { Contact } from "@/components/sections/contact";
import { Experience } from "@/components/sections/experience";
import { Leadership } from "@/components/sections/leadership";
import { Skills } from "@/components/sections/skills";
import { Writing } from "@/components/sections/writing";
import { profile } from "@/content";
import { CONTAINER, LABEL_MUTED } from "@/lib/styles";

export const metadata: Metadata = {
  title: "About",
  description: profile.intro,
  alternates: { canonical: "/about" },
  // Without this a shared page would show the home page's card.
  openGraph: {
    title: `About · ${profile.name}`,
    description: profile.intro,
    url: "/about",
    type: "profile",
  },
};

/** Everything that is not project work: who I am, where I worked, how to reach me. */
export default function AboutPage() {
  return (
    <main className={`${CONTAINER} pt-10 pb-8 sm:pt-14`}>
      <header className="pb-14 sm:pb-20">
        <p className={LABEL_MUTED}>
          {profile.role} · {profile.location}
        </p>
        <h1 className="mt-3 font-display text-[clamp(28px,5.6vw,4.6rem)] leading-[0.92] font-black tracking-[-0.03em] text-foreground uppercase [font-stretch:125%] [overflow-wrap:anywhere] text-balance">
          {profile.name}
        </h1>
        <p className="mt-6 max-w-[40rem] text-[1.2rem] leading-[1.55] text-pretty text-muted-foreground">
          {profile.headline}
        </p>
      </header>
      <div className="flex flex-col gap-20 sm:gap-28">
        <About />
        <Experience />
        <Skills />
        <Leadership />
        <Writing />
        <Contact />
      </div>
    </main>
  );
}
