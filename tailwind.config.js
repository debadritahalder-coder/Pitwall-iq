/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        carbon: "#15151e",
        navy: "#1e1e2e",
        panel: "#1a1a28",
        line: "#2a2a3a",
        racing: "#e10600",
        crimson: "#7f1117",
        gold: "#c8a45d",
        electric: "#2f8cff",
        "f1-dark": "#15151e",
        "f1-gray": "#38383f",
        "f1-surface": "#1e1e28",
      },
      boxShadow: {
        glow: "0 0 40px rgba(225, 6, 0, 0.18)",
      },
    },
  },
  plugins: [],
};
