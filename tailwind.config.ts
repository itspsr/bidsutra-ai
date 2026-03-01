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
        sans: ["ui-sans-serif", "system-ui", "Inter", "Segoe UI", "Roboto", "Arial"]
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: "hsl(var(--card))",
        cardForeground: "hsl(var(--card-foreground))",
        muted: "hsl(var(--muted))",
        mutedForeground: "hsl(var(--muted-foreground))",
        border: "hsl(var(--border))",
        ring: "hsl(var(--ring))",
        primary: "hsl(var(--primary))",
        primaryForeground: "hsl(var(--primary-foreground))",
        secondary: "hsl(var(--secondary))",
        secondaryForeground: "hsl(var(--secondary-foreground))",
        accent: "hsl(var(--accent))",
        accentForeground: "hsl(var(--accent-foreground))",

        navy: {
          950: "#060B18",
          900: "#0A1230",
          800: "#101B44",
          700: "#16245A"
        },
        steel: {
          900: "#0F172A",
          800: "#1E293B",
          700: "#334155",
          600: "#475569",
          500: "#64748B"
        },
        gold: {
          700: "#9A7622",
          600: "#B58B2A",
          500: "#C49A33",
          400: "#D4B15A"
        }
      },
      boxShadow: {
        elev1: "0 10px 25px rgba(2, 6, 23, 0.25)",
        elev2: "0 20px 50px rgba(2, 6, 23, 0.35)",
        insetGlow: "inset 0 1px 0 rgba(255,255,255,0.06)"
      },
      borderRadius: {
        xl: "16px"
      }
    }
  },
  plugins: []
} satisfies Config;
