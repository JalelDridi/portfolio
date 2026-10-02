import { Contact } from "@/components/sections/contact";
import { Experience } from "@/components/sections/experience";
import { Flagship } from "@/components/sections/flagship";
import { Hero } from "@/components/sections/hero";
import { Metrics } from "@/components/sections/metrics";
import { Skills } from "@/components/sections/skills";
import { Work } from "@/components/sections/work";

export default function Home() {
  return (
    <main>
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
