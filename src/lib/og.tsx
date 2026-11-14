import { ImageResponse } from "next/og";
import { profile } from "@/content";

export const OG_SIZE = { width: 1200, height: 630 };

/** Nail heads down the blue band, top to bottom. */
const STUDS = Array.from({ length: 13 }, (_, index) => index);

/**
 * The card shown when a page is shared: the whitewashed wall, a blue band
 * with a column of studs at the left, ink text. Satori lays this out with
 * flexbox only, so every element with more than one child is `display: flex`.
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
        background: "#faf9f4",
        color: "#101922",
      }}
    >
      <div
        style={{
          width: 96,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "26px 0",
          background: "#1763b6",
        }}
      >
        {STUDS.map((index) => (
          <div
            key={index}
            style={{
              width: 14,
              height: 14,
              borderRadius: 7,
              background: "#10151b",
            }}
          />
        ))}
      </div>
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
            color: "#1763b6",
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
              color: "#101922",
              // The bundled font has one weight; a stroke makes it heavy.
              WebkitTextStroke: "3px #101922",
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: 32,
              marginTop: 28,
              color: "#4b5764",
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
            color: "#4b5764",
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
