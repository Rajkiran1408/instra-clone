/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        fadeOut: {
          '0%': { opacity: 1 },
          '100%': { opacity: 0 },
        },
      },
      animation: {
        fadeOut: 'fadeOut 2s forwards', 
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      "light",
      {
        black: {
          "primary": "rgb(29, 155, 240)",
          "secondary": "rgb(24, 24, 24)",
          "base-100": "#000000",
        }
      }
    ]
  }
}