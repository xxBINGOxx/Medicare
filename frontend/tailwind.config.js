/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          500: '#10B981', // Emerald 500
          600: '#059669', // Emerald 600
          700: '#047857',
        }
      }
    },
  },
  plugins: [],
}
