/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        carbon: "#06080d",
        navy: "#0b1220",
        panel: "#101827",
        line: "#263247",
        racing: "#e10600",
        crimson: "#7f1117",
        gold: "#c8a45d",
        electric: "#2f8cff",
      },
      boxShadow: {
        glow: "0 0 40px rgba(225, 6, 0, 0.18)",
      },
    },
  },
  plugins: [],
};
