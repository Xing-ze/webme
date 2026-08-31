import type { Config } from 'tailwindcss'

export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: "rgb(var(--color-surface) / <alpha-value>)",
        surfaceSecondary: "rgb(var(--color-surface-secondary) / <alpha-value>)",
        surfaceTertiary: "rgb(var(--color-surface-tertiary) / <alpha-value>)",
        text: "rgb(var(--color-text) / <alpha-value>)",
        textSecondary: "rgb(var(--color-text-secondary) / <alpha-value>)",
        textTertiary: "rgb(var(--color-text-tertiary) / <alpha-value>)",
        border: "rgb(var(--color-border) / <alpha-value>)",
        accent: "rgb(var(--color-accent) / <alpha-value>)",
        accentHover: "rgb(var(--color-accent-hover) / <alpha-value>)",
        danger: "#ef4444",
        success: "#22c55e",
        warning: "#f59e0b",
      },
      borderRadius: {
        glass: "16px",
        xl2: "20px",
        fullButton: "999px",
      },
      boxShadow: {
        card: "0 4px 20px -2px rgba(0,0,0,0.08), 0 2px 6px -2px rgba(0,0,0,0.04)",
        cardHover: "0 12px 40px -6px rgba(0,0,0,0.15), 0 4px 12px -4px rgba(0,0,0,0.08)",
        glow: "0 0 24px 0 rgb(var(--color-accent) / 0.25)",
      },
    },
  },
  plugins: [],
} satisfies Config
