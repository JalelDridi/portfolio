import Image from "next/image";
import type { ReactNode } from "react";
import {
  caseStudies,
  education,
  experience,
  flagship,
  profile,
} from "@/content";

function Tags({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-wrap gap-2" aria-label="Technologies">
      {items.map((item) => (
        <li
          key={item}
          className="rounded-full border border-line px-2.5 py-0.5 text-sm text-muted"
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

function ButtonLink({
  href,
  primary = false,
  children,
}: {
  href: string;
  primary?: boolean;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      className={
        primary
          ? "rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90"
          : "rounded-md border border-line px-4 py-2 text-sm font-medium hover:bg-subtle"
      }
    >
      {children}
    </a>
  );
}

function SectionHeading({ id, children }: { id: string; children: ReactNode }) {
  return (
    <h2
      id={id}
      className="text-sm font-semibold tracking-widest text-muted uppercase"
    >
      {children}
    </h2>
  );
}

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-20 px-5 py-16 sm:py-24">
      <header className="flex flex-col gap-6">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            {profile.name}
          </h1>
          <p className="mt-3 text-lg text-muted">{profile.headline}</p>
          <p className="mt-1 text-muted">
            {profile.availability} · {profile.location}
          </p>
        </div>
        <div className="flex flex-col gap-4 text-lg leading-relaxed">
          {profile.intro.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <nav aria-label="Contact" className="flex flex-wrap gap-3">
          <ButtonLink primary href={`mailto:${profile.links.email}`}>
            Email me
          </ButtonLink>
          <ButtonLink href={profile.links.github}>GitHub</ButtonLink>
          <ButtonLink href={profile.links.linkedin}>LinkedIn</ButtonLink>
        </nav>
      </header>

      <section aria-labelledby="project" className="flex flex-col gap-6">
        <SectionHeading id="project">Open-source project</SectionHeading>
        <article className="overflow-hidden rounded-xl border border-line">
          <a
            href={flagship.demo}
            className="block border-b border-line bg-subtle"
            aria-label={`Open the ${flagship.name} live demo`}
          >
            <Image
              src={flagship.image.src}
              alt={flagship.image.alt}
              width={2400}
              height={3000}
              priority
              sizes="(min-width: 768px) 768px, 100vw"
              className="aspect-[16/10] w-full object-cover object-top"
            />
          </a>
          <div className="flex flex-col gap-5 p-6">
            <div>
              <h3 className="text-2xl font-semibold tracking-tight">
                {flagship.name}
              </h3>
              <p className="mt-1 text-muted">{flagship.tagline}</p>
            </div>
            <p className="leading-relaxed">{flagship.summary}</p>
            <ul className="flex list-disc flex-col gap-2 pl-5 leading-relaxed">
              {flagship.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
            <Tags items={flagship.stack} />
            <div className="flex flex-wrap gap-3">
              <ButtonLink primary href={flagship.demo}>
                Try the live demo
              </ButtonLink>
              <ButtonLink href={flagship.repo}>Read the code</ButtonLink>
            </div>
          </div>
        </article>
      </section>

      <section aria-labelledby="work" className="flex flex-col gap-10">
        <SectionHeading id="work">Work</SectionHeading>
        {caseStudies.map((study) => (
          <article key={study.title} className="flex flex-col gap-4">
            <div>
              <h3 className="text-2xl font-semibold tracking-tight">
                {study.title}
              </h3>
              <p className="mt-1 text-muted">{study.context}</p>
            </div>
            <p className="leading-relaxed">{study.why}</p>
            <ul className="flex list-disc flex-col gap-2 pl-5 leading-relaxed">
              {study.built.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            {study.outcome && (
              <p className="leading-relaxed">{study.outcome}</p>
            )}
            <Tags items={study.stack} />
            {study.link && (
              <p>
                <a className="font-medium underline" href={study.link.href}>
                  {study.link.label}
                </a>
              </p>
            )}
          </article>
        ))}
      </section>

      <section aria-labelledby="experience" className="flex flex-col gap-6">
        <SectionHeading id="experience">Experience</SectionHeading>
        <ul className="flex flex-col gap-5">
          {experience.map((job) => (
            <li
              key={`${job.company}-${job.period}`}
              className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
            >
              <div>
                <p className="font-medium">
                  {job.role} · {job.company}
                </p>
                <p className="text-muted">{job.detail}</p>
              </div>
              <p className="shrink-0 text-muted">{job.period}</p>
            </li>
          ))}
        </ul>
        <p className="text-muted">{education}</p>
      </section>

      <footer className="flex flex-col gap-4 border-t border-line pt-8">
        <SectionHeading id="contact">Contact</SectionHeading>
        <p className="text-lg leading-relaxed">
          The quickest way to reach me is{" "}
          <a className="underline" href={`mailto:${profile.links.email}`}>
            {profile.links.email}
          </a>
          . I&apos;m also on{" "}
          <a className="underline" href={profile.links.linkedin}>
            LinkedIn
          </a>{" "}
          and{" "}
          <a className="underline" href={profile.links.github}>
            GitHub
          </a>
          .
        </p>
      </footer>
    </main>
  );
}
