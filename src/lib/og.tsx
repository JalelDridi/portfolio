import { ImageResponse } from "next/og";
import { profile } from "@/content";

export const OG_SIZE = { width: 1200, height: 630 };

/** The card shown when a page is shared: paper, ink and cobalt. */
export function ogCard({
  eyebrow,
  title,
  text,
}: {
  eyebrow: string;
  title: string;
  text: string;
}) {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 72,
        background: "#f3f5f2",
        color: "#141a1f",
        borderTop: "4px solid #141a1f",
      }}
    >
      <div
        style={{
          display: "flex",
          fontSize: 26,
          letterSpacing: 4,
          textTransform: "uppercase",
          fontFamily: "ui-monospace, Menlo, monospace",
          color: "#1f3fd1",
        }}
      >
        {eyebrow}
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            fontSize: title.length > 44 ? 56 : title.length > 28 ? 68 : 84,
            fontWeight: 800,
            lineHeight: 1.05,
            color: "#141a1f",
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: 34,
            marginTop: 28,
            color: "#4b5660",
            lineHeight: 1.3,
          }}
        >
          {text}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 26,
          color: "#4b5660",
        }}
      >
        <div>{profile.name}</div>
        <div>jaleldridi.vercel.app</div>
      </div>
    </div>,
    OG_SIZE,
  );
}
