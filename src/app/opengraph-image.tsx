import { ImageResponse } from "next/og";
import { site } from "@/content/site";

export const alt = `${site.name} — SW Miami`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const INK = "#212020";
const CREAM = "#f7f7f7";
const BLUSH = "#E8B4A3";
const MUTED = "#6b6a6a";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: CREAM,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 88px",
          fontFamily: "serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 32, height: 2, background: BLUSH }} />
          <span
            style={{
              fontSize: 22,
              letterSpacing: 6,
              textTransform: "uppercase",
              color: MUTED,
              fontFamily: "sans-serif",
              fontWeight: 600,
            }}
          >
            SW Miami · Licensed Care Team
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <h1
            style={{
              fontSize: 96,
              lineHeight: 1.02,
              color: INK,
              margin: 0,
              letterSpacing: -2,
              fontWeight: 500,
            }}
          >
            Hello again,{" "}
            <span style={{ color: BLUSH, fontStyle: "italic" }}>you.</span>
          </h1>
          <p
            style={{
              fontSize: 34,
              lineHeight: 1.35,
              color: MUTED,
              margin: 0,
              maxWidth: 900,
              fontFamily: "sans-serif",
            }}
          >
            Whole-body wellness in Miami — weight loss, aesthetics, IV therapy,
            hormone care, and Galleri® screening.
          </p>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: `1px solid ${INK}22`,
            paddingTop: 24,
            fontFamily: "sans-serif",
          }}
        >
          <span style={{ fontSize: 26, color: INK, fontWeight: 600 }}>
            {site.name}
          </span>
          <span style={{ fontSize: 22, color: MUTED }}>
            {site.address.line1} · {site.address.city}, {site.address.state}
          </span>
        </div>
      </div>
    ),
    { ...size },
  );
}
