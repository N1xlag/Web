/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        paper:          '#F7F5F0',
        ink:            '#111111',
        'ink-2':        '#555555',
        'ink-3':        '#999999',
        border:         '#DEDBD5',
        'border-strong':'#BDBAB4',
        danger:         '#A32D2D',
      },
      fontFamily: {
        display: ['"Barlow Condensed"', 'sans-serif'],
        body:    ['"DM Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};