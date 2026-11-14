"use client";

import { useEffect, useState } from "react";

/** Copies `text` to the clipboard and says so for two seconds. */
export function CopyButton({
  text,
  label = "Copy email",
}: {
  text: string;
  label?: string;
}) {
  // Counts successful copies; each one restarts the two-second "Copied".
  const [copies, setCopies] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (copies === 0) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copies]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setCopies((count) => count + 1);
    } catch {
      // No clipboard access: the address is on screen to copy by hand.
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-live="polite"
      className="border border-foreground px-2 py-0.5 font-mono text-[0.78rem] whitespace-nowrap transition-colors hover:bg-foreground hover:text-background"
    >
      {copied ? "Copied" : label}
    </button>
  );
}
