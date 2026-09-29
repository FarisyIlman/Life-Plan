import { ImageResponse } from "next/og";

export const alt = "Farisy — Through The Time";
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
        justifyContent: "space-between",
        padding: "64px 76px",
        color: "#E8E9ED",
        background: "linear-gradient(135deg, #12141C 0%, #1A1D29 100%)",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div
          style={{
            width: 52,
            height: 52,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "2px solid #7C6FEF",
            borderRadius: 14,
            color: "#22D3EE",
            fontSize: 32,
          }}
        >
          ∞
        </div>
        <div style={{ color: "#9497A6", fontSize: 20, letterSpacing: 2 }}>
          FARISY SYARIF
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ color: "#22D3EE", fontSize: 20, letterSpacing: 4 }}>
          A PERSONAL LIFE JOURNEY
        </div>
        <div style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.05 }}>
          Through The Time
        </div>
        <div style={{ color: "#B5B7C2", fontSize: 27 }}>
          A living story of goals, chapters, and becoming.
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <div style={{ width: 96, height: 2, background: "#7C6FEF" }} />
        <div style={{ color: "#FBBF24", fontSize: 18, letterSpacing: 2 }}>
          2026 — FUTURE
        </div>
        <div style={{ flex: 1, height: 1, background: "#2A2E3F" }} />
        <div style={{ color: "#9497A6", fontSize: 18 }}>KEEP GROWING</div>
      </div>
    </div>,
    size,
  );
}
