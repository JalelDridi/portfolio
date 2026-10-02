import { profile } from "@/content";

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-5 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>
          {profile.name} · {profile.location}
        </p>
        <p>
          Built with Next.js.{" "}
          <a
            className="underline underline-offset-4 hover:text-foreground"
            href="https://github.com/JalelDridi/portfolio"
          >
            Source on GitHub
          </a>
        </p>
      </div>
    </footer>
  );
}
