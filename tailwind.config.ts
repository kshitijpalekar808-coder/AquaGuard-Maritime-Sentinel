import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#050505",
        ocean: {
          950: "#040810",
          900: "#070e1b",
          850: "#0b1528",
          800: "#0f1f38",
          700: "#172e50",
          600: "#1e3a66",
        },
        cyan: {
          400: "#38bdf8",
          500: "#06b6d4",
          300: "#7dd3fc",
        },
        alert: {
          amber: "#f59e0b",
          red: "#ef4444",
        }
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
