const { nextui } = require('@nextui-org/react')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    'src/**/*.{js,jsx,ts,tsx}',
    '../node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      keyframes: {
        'caret-blink': {
          '0%,70%,100%': { opacity: '1' },
          '20%,50%': { opacity: '0' },
        },
        'drip-expand-hold': {
          '0%': {
            transform: 'scale(0)',
            opacity: 1,
          },
          '30%,80%': {
            transform: 'scale(1)',
            opacity: 1,
          },
          '100%': {
            opacity: 0,
          },
        },
      },
      animation: {
        'caret-blink': 'caret-blink 1.2s ease-out infinite',
        'drip-expand-hold': 'drip-expand-hold 1s ease-out',
      },
    },
  },
  darkMode: 'class',
  plugins: [nextui()],
}
