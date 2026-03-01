import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}",
    "./utils/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Inter",
          "SF Pro Display",
          "Segoe UI",
          "Roboto",
          "Arial"
        ],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "Liberation Mono", "monospace"],
        numeric: ["ui-sans-serif", "system-ui", "Inter", "SF Pro Display", "Segoe UI"]
      },
      colors: {
        bg: {
          DEFAULT: "#0A1A2F",
          0: "#060B14",
          1: "#0A1A2F",
          2: "#0F172A",
          3: "#111827",
          4: "#0B1220"
        },
        surface: {
          1: "#0F172A",
          2: "#111827",
          3: "#0B1220"
        },
        line: {
          DEFAULT: "rgba(148,163,184,0.12)",
          strong: "rgba(148,163,184,0.18)"
        },
        text: {
          1: "#F9FAFB",
          2: "#9CA3AF",
          3: "rgba(249,250,251,0.72)"
        },
        gold: {
          DEFAULT: "#C8A94C",
          700: "#B9922F",
          600: "#C8A94C",
          500: "#D7BD73"
        },
        teal: {
          DEFAULT: "#2DD4BF",
          700: "#0EA5A6",
          600: "#2DD4BF",
          500: "#6EE7D8"
        },
        success: "#10B981",
        warning: "#F59E0B",
        critical: "#EF4444"
      },
      borderRadius: {
        sm: "10px",
        md: "12px",
        lg: "14px"
      },
      boxShadow: {
        soft: "0 1px 0 rgba(255,255,255,0.04), 0 10px 30px rgba(0,0,0,0.28)",
        hover: "0 1px 0 rgba(255,255,255,0.06), 0 16px 40px rgba(0,0,0,0.32)",
        inset: "inset 0 1px 0 rgba(255,255,255,0.04)"
      },
      letterSpacing: {
        tighter2: "-0.03em"
      }
    }
  },
  plugins: []
} satisfies Config;
