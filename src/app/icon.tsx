import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          background: "#212020",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#E8B4A3",
          fontSize: 13,
          fontWeight: 700,
          fontFamily: "Georgia, serif",
          letterSpacing: 1,
        }}
      >
        HY
      </div>
    ),
    { ...size },
  );
}
