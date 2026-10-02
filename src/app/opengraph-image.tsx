import { ImageResponse } from "next/og";
import { profile } from "@/content";

export const alt = `${profile.name}: ${profile.headline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: 80,
        background: "#1b1b1a",
        color: "#fcfcfb",
      }}
    >
      <div style={{ fontSize: 76, fontWeight: 700 }}>{profile.name}</div>
      <div style={{ fontSize: 34, marginTop: 24, color: "#c9c9c4" }}>
        {profile.headline}
      </div>
      <div style={{ fontSize: 28, marginTop: 48, color: "#c9c9c4" }}>
        Case studies and Payout Ledger, an open-source payout monitor
      </div>
    </div>,
    size,
  );
}
