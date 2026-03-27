/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './App.tsx', './index.js'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // ModaMi design tokens — mirrors fe-modami-service globals.css
        primary: '#274f38',
        'primary-container': '#3f674f',
        secondary: '#5f5e5e',
        background: '#f9f9f8',
        surface: '#ffffff',
        'surface-low': '#f3f4f3',
        'surface-container': '#edeeed',
        'surface-high': '#e7e8e7',
        'surface-highest': '#e1e3e2',
        'on-surface': '#191c1c',
        'on-primary': '#ffffff',
        'outline-variant': '#c1c8c1',
      },
      fontFamily: {
        sans: ['Manrope', 'System'],
        mono: ['Courier New', 'monospace'],
      },
    },
  },
  plugins: [],
};
