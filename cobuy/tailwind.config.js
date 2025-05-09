/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: '#FDF8F2',
        secondary: '#C39C89',
        block: '#EEE2D3',
        dark: '#8D6F60'
      }
    },
  },
  plugins: [],
}