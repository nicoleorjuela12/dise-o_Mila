/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      height: {
        '150': '37.5zrem',  // Personalizado: 600px
        '152': '38rem',
      }
    },
  },
  plugins: [],
}


