// tailwind.config.js
import { fontFamily } from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", ...fontFamily.sans],
      },
      colors: {
        primary: "#b22222", // muddy red (firebrick)
        brand: {
          blue: "#2563eb",   // Tailwind blue-600
          green: "#16a34a",  // Tailwind green-600
          red: "#dc2626",    // Tailwind red-600
          rust: "#b22222",   // muddy red (firebrick)
        },
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
    require("@tailwindcss/aspect-ratio"),
  ],
};

export default config;
