// /tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        // Example custom palette if you want to expand later
        brand: {
          light: "#60a5fa", // Tailwind blue-400
          DEFAULT: "#3b82f6", // Tailwind blue-500
          dark: "#2563eb", // Tailwind blue-600
        },
      },
    },
  },
  plugins: [], // 🚫 keep empty unless you explicitly add plugins
};
