/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,vue}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        parchment: '#f4f1e8',
        ink: '#2c1810',
        leather: '#8b4513',
        'leather-dark': '#654321',
        'parchment-dark': '#e8dcc6',
      },
      fontFamily: {
        medieval: ['Georgia', 'serif'],
        fantasy: ['Cinzel', 'serif'],
      },
      borderRadius: {
        'medieval': '12px',
        'scroll': '8px 16px 8px 16px',
      },
      boxShadow: {
        'medieval': '0 4px 8px rgba(44, 24, 16, 0.3)',
        'scroll': 'inset 0 0 10px rgba(44, 24, 16, 0.1)',
      },
    },
  },
  plugins: [],
};
