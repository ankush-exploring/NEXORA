/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        white: '#F5FEFD',
        nexora: {
          50: '#faf5ff',
          100: '#f3e8ff',
          500: '#8A2BE2', // Electric Violet Accent
          600: '#7e22ce',
          900: '#581c87',
        },
        light: {
          bg: '#fafafa',       // off-white background
          card: '#ffffff',     // clean cards
          border: '#e5e7eb',   // subtle border
          muted: '#6b7280',    // muted text
          text: '#0a0a0a',     // deep black text
        },
        dark: {
          bg: '#0a0a0a',       // Deep black primary
          card: '#171717',
          border: '#262626',
          muted: '#a3a3a3',
          text: '#fafafa',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
