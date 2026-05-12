/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        coffee: {
          50: "#fbf7f2",
          100: "#f1e6d6",
          200: "#dec3a3",
          300: "#c79c70",
          400: "#a8794b",
          500: "#825a35",
          600: "#5e3f24",
          700: "#3e2917",
        },
      },
    },
  },
  plugins: [],
};
