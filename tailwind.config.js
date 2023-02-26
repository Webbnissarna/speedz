/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx,jsx,js}"],
  theme: {
    extend: {
      keyframes: {
        gradient: {
          "0%, 100%": { "background-position": "0 0" },
          "50%": { "background-position": "100% 100%" },
        },
      },
      animation: {
        gradient: "gradient 1s ease-in-out infinite",
      },
      fontFamily: {
        h1: "'Jost-SemiBold', sans-serif",
        h2: "'Jost-Medium', sans-serif",
        body: "'Jost-Regular', sans-serif",
      },
    },
  },
  plugins: [],
};
