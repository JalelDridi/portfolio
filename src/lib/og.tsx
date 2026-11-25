import { ImageResponse } from "next/og";
import { profile } from "@/content";

export const OG_SIZE = { width: 1200, height: 630 };

/**
 * The card shown when a page is shared: a black ground, a red bar down the
 * left, off-white text. Satori lays this out with flexbox only, so every
 * element with more than one child is `display: flex`.
 */
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
        background: "#070707",
        color: "#ece8e1",
      }}
    >
      <div style={{ width: 96, height: "100%", background: "#e10600" }} />
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 26,
            letterSpacing: 4,
            textTransform: "uppercase",
            fontFamily: "ui-monospace, Menlo, monospace",
            color: "#ff4a3d",
          }}
        >
          {eyebrow}
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: title.length > 44 ? 56 : title.length > 28 ? 68 : 84,
              fontWeight: 900,
              lineHeight: 1,
              letterSpacing: -1,
              textTransform: "uppercase",
              color: "#ece8e1",
              // The bundled font has one weight; a stroke makes it heavy.
              WebkitTextStroke: "3px #ece8e1",
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: 32,
              marginTop: 28,
              color: "#9a968f",
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
            color: "#9a968f",
          }}
        >
          <div>{profile.name}</div>
          <div>jaleldridi.vercel.app</div>
        </div>
      </div>
    </div>,
    OG_SIZE,
  );
}
