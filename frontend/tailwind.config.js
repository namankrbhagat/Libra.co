/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--bg-0)", // Mapping CSS var to Tailwind utility
        foreground: "var(--text-100)",
      },
      fontFamily: {
        "instrument-serif": ['"Instrument Serif"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        fadeSlideIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      },
      animation: {
        'fade-slide-in-1': 'fadeSlideIn 1s ease-out forwards',
        'fade-slide-in-2': 'fadeSlideIn 1s ease-out 0.2s forwards',
        'fade-slide-in-3': 'fadeSlideIn 1s ease-out 0.4s forwards',
        'fade-slide-in-4': 'fadeSlideIn 1s ease-out 0.6s forwards',
      }
    },
  },
  plugins: [],
}
