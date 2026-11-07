/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}', '!./src/test/**'],
  theme: {
    extend: {
      colors: {
        // Deep ink navy: the brand base
        navy: { 950: '#040C18', 900: '#0A1D37', 800: '#102A4C', 700: '#173B69', 600: '#214E87' },
        // Rich cerulean: water accents, links, icons
        water: { 50: '#EEF6FB', 100: '#D8EAF6', 200: '#B0D5EC', 300: '#7CBBE4', 400: '#3E9DD6', 500: '#1B84C4', 600: '#146AA0', 700: '#0F5380' },
        // Brass / gold: premium accent for primary CTAs and highlights
        gold: { 50: '#FBF6EA', 100: '#F5E9C8', 200: '#EBD59B', 300: '#E0C079', 400: '#D2AA5C', 500: '#BE933F', 600: '#9C762C', 700: '#785921' },
        // Earth brown: warm neutrals for backgrounds and secondary accents
        earth: { 50: '#FAF6EF', 100: '#F3EBDD', 200: '#E6D6BC', 300: '#CDB28A', 400: '#AC8456', 500: '#87593A', 600: '#6B4630', 700: '#4F3322' },
      },
      fontFamily: {
        display: ['"Sora Variable"', '"Noto Sans Kannada Variable"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['"Inter Variable"', '"Noto Sans Kannada Variable"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(10,29,55,.06), 0 14px 34px -14px rgba(10,29,55,.22)',
        glow: '0 0 0 1px rgba(210,170,92,.45), 0 20px 50px -14px rgba(10,29,55,.35)',
        gold: '0 10px 30px -10px rgba(190,147,63,.65)',
      },
      keyframes: {
        'wave': { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } },
        'wave-rev': { '0%': { transform: 'translateX(-50%)' }, '100%': { transform: 'translateX(0)' } },
        'pulse-ring': { '0%': { transform: 'scale(.9)', opacity: '.7' }, '100%': { transform: 'scale(1.6)', opacity: '0' } },
      },
      animation: {
        wave: 'wave 14s linear infinite',
        'wave-slow': 'wave-rev 24s linear infinite',
        'pulse-ring': 'pulse-ring 2s ease-out infinite',
      },
    },
  },
  plugins: [],
}
