/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dickens: {
          green: '#1E4538',
          lightgreen: '#2A5C49',
          gold: '#B8862C',
          cream: '#F7F1E4',
          brown: '#5A4433',
          red: '#7A2E2E',
        }
      },
      fontFamily: {
        gothic: ['Libre Baskerville', 'Georgia', 'serif'],
        sans: ['Work Sans', 'Arial', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
