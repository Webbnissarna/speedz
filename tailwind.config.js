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
        rotation: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        nudgeRight: {
          "0%": { transform: "translateX(0)" },
          "50%": { transform: "translateX(8px)" },
          "100%": { transform: "translateX(0)" },
        },
        nudgeLeft: {
          "0%": { transform: "translateX(0)" },
          "50%": { transform: "translateX(-8px)" },
          "100%": { transform: "translateX(0)" },
        },
        scale: {
          "0%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.1)" },
          "100%": { transform: "scale(1)" },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(-6deg)" },
          "50%": { transform: "rotate(6deg)" },
        },
        translate: {
          "0%": { transform: "translateX(-100%)" },
          "50%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        gradient: "gradient 1s ease-in-out infinite",
        rotate: "rotation 4s linear infinite",
        nudgeRight: "nudgeRight 2s ease-in-out infinite",
        nudgeLeft: "nudgeLeft 2s ease-in-out infinite",
        scale: "scale 2s ease-in-out infinite",
        wiggle: "wiggle 1s ease-in-out infinite",
        translate: "translate 2s linear infinite",
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
