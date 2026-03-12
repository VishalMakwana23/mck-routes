/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        app: {
          bg: "var(--bg-app)",
          muted: "var(--bg-muted)",
          elevated: "var(--bg-elevated)",
          strong: "var(--bg-strong)",
          accentSoft: "var(--bg-accent-soft)",
          dark: "var(--bg-dark)",
        },
        ink: {
          strong: "var(--text-strong)",
          base: "var(--text-base)",
          muted: "var(--text-muted)",
          inverse: "var(--text-inverse)",
        },
        brand: {
          DEFAULT: "var(--brand)",
          strong: "var(--brand-strong)",
          soft: "var(--brand-soft)",
          ring: "var(--brand-ring)",
        },
        stroke: {
          soft: "var(--border-soft)",
          strong: "var(--border-strong)",
        },
        danger: "var(--danger)",
        warning: "var(--warning)",
        accentOrange: "var(--accent-orange)",
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
      },
      boxShadow: {
        soft: "var(--shadow-soft)",
        card: "var(--shadow-card)",
        glow: "var(--shadow-glow)",
      },
    },
  },
  plugins: [],
}
