/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx,scss}'],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#BC477B',
          DEFAULT: '#880E4F',
          dark: '#560027',
        },
      },
    },
  },
  plugins: [],
}
