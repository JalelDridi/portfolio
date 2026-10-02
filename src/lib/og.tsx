import { ImageResponse } from "next/og";
import { profile } from "@/content";

export const OG_SIZE = { width: 1200, height: 630 };

/** The card shown when a page is shared: dark, with the site's green. */
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
        background: "#0b1416",
        backgroundImage: "linear-gradient(135deg, #0b1416 55%, #0f3d30 100%)",
        color: "#f1f5f4",
      }}
    >
      <div
        style={{
          display: "flex",
          fontSize: 26,
          letterSpacing: 4,
          textTransform: "uppercase",
          color: "#34d399",
        }}
      >
        {eyebrow}
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            fontSize: title.length > 44 ? 56 : title.length > 28 ? 68 : 84,
            fontWeight: 700,
            lineHeight: 1.05,
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: 34,
            marginTop: 28,
            color: "#b6c4c1",
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
          color: "#b6c4c1",
        }}
      >
        <div>{profile.name}</div>
        <div>jaleldridi.vercel.app</div>
      </div>
    </div>,
    OG_SIZE,
  );
}
