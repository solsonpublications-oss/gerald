import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Rounds of a Lifetime — A Memoir by Robert Y. Wright, MD";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background:
            "linear-gradient(135deg, #5b2a86 0%, #6a3aa0 40%, #7ec1e0 100%)",
          padding: "70px 80px",
          fontFamily: "sans-serif",
        }}
      >
        {/* Top row: badge + pulse */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
              background: "rgba(255,255,255,0.15)",
              border: "1px solid rgba(255,255,255,0.35)",
              borderRadius: "999px",
              padding: "10px 24px",
              backdropFilter: "blur(8px)",
            }}
          >
            <div
              style={{
                width: "12px",
                height: "12px",
                borderRadius: "999px",
                background: "#fff",
                boxShadow: "0 0 12px rgba(255,255,255,0.8)",
              }}
            />
            <span
              style={{
                color: "#fff",
                fontSize: "20px",
                fontWeight: 600,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
              }}
            >
              A New Medical Memoir
            </span>
          </div>
          {/* heartbeat pulse icon */}
          <svg
            width="80"
            height="80"
            viewBox="0 0 48 48"
            fill="none"
            style={{ opacity: 0.9 }}
          >
            <circle
              cx="24"
              cy="24"
              r="22"
              stroke="#fff"
              strokeWidth="1.5"
              opacity="0.3"
            />
            <path
              d="M6 24 H16 L19 14 L24 34 L29 18 L32 24 H42"
              stroke="#fff"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Center: title */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <div
            style={{
              color: "#fff",
              fontSize: "104px",
              fontWeight: 800,
              lineHeight: 0.95,
              letterSpacing: "-0.02em",
              textShadow: "0 4px 24px rgba(0,0,0,0.25)",
            }}
          >
            Rounds of a
          </div>
          <div
            style={{
              color: "#eaf4fa",
              fontSize: "104px",
              fontWeight: 800,
              lineHeight: 0.95,
              letterSpacing: "-0.02em",
              textShadow: "0 4px 24px rgba(0,0,0,0.25)",
            }}
          >
            Lifetime
          </div>
        </div>

        {/* Bottom: EKG line + author */}
        <div
          style={{ display: "flex", flexDirection: "column", gap: "24px" }}
        >
          {/* EKG line */}
          <svg
            width="100%"
            height="40"
            viewBox="0 0 1040 40"
            preserveAspectRatio="none"
          >
            <path
              d="M0 20 H200 L215 8 L235 34 L255 4 L275 36 L295 14 H400 L420 20 H520 L535 8 L555 34 L575 4 L595 36 L615 14 H720 L740 20 H840 L855 8 L875 34 L895 4 L915 36 L935 14 H1040"
              fill="none"
              stroke="#fff"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.7"
            />
          </svg>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <span
                style={{
                  color: "#fff",
                  fontSize: "30px",
                  fontWeight: 600,
                  fontStyle: "italic",
                }}
              >
                Robert Y. Wright, MD
              </span>
              <span
                style={{
                  color: "rgba(255,255,255,0.7)",
                  fontSize: "20px",
                }}
              >
                Published as Robert Y. Wright, MD
              </span>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
                gap: "4px",
              }}
            >
              <span
                style={{
                  color: "rgba(255,255,255,0.6)",
                  fontSize: "16px",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                ISBN 978-929-167-7346
              </span>
              <span
                style={{
                  color: "#fff",
                  fontSize: "22px",
                  fontWeight: 700,
                }}
              >
                roundsofalifetime.com
              </span>
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
