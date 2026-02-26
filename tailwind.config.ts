import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Playfair Display'", "serif"],
        body: ["'DM Sans'", "sans-serif"],
      },
      colors: {
        primary: {
          50: "#f9f7f4",
          100: "#f0ebe2",
          200: "#e0d4c1",
          300: "#c8b898",
          400: "#b09870",
          500: "#9a7d54",
          600: "#7d6244",
          700: "#664f38",
          800: "#544132",
          900: "#46372b",
        },
        accent: {
          DEFAULT: "#c9a96e",
          dark: "#a8874d",
          light: "#e8d5b0",
        },
        neutral: {
          50: "#fafafa",
          100: "#f5f5f5",
          900: "#1a1a1a",
        }
      },
      animation: {
        "fade-up": "fadeUp 0.6s ease-out forwards",
        "fade-in": "fadeIn 0.4s ease-out forwards",
        "slide-in": "slideIn 0.5s ease-out forwards",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideIn: {
          "0%": { opacity: "0", transform: "translateX(-20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
