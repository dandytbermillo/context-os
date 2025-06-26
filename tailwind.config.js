/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e3f2fd',
          100: '#bbdefb',
          500: '#2196f3',
          600: '#1976d2',
          700: '#1565c0',
        },
        annotation: {
          highlight: '#ffd700',
          marker: '#e3f2fd',
          border: '#2196f3',
        }
      },
      boxShadow: {
        'panel': '0 2px 8px rgba(0,0,0,0.1)',
        'annotation': '0 4px 12px rgba(0,0,0,0.15)',
      }
    },
  },
  plugins: [],
}