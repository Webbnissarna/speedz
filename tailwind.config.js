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
        h1: "'Kodchasan-SemiBold', sans-serif",
        h2: "'Kodchasan-Medium', sans-serif",
        body: "'Kodchasan-Regular', sans-serif",
      },
      maxWidth: {
        form: 350,
      },
    },
  },
  plugins: [],
};
