/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        maincolor: "var(--color-maincolor)",
        secondcolor: "var(--color-secondcolor)",
        bgcolor: "var(--color-bgcolor)",
      },
    },
  },
  plugins: [],
};