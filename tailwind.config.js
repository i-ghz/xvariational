/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Variational's own palette, lifted from their stylesheet.
        page: '#f7f8fa',
        card: '#ffffff',
        sunken: '#f3f4f7',
        line: '#e9edf1',
        'line-2': '#ced5df',
        ink: '#151a25',
        muted: '#6c829d',
        dim: '#a0aec0',
        accent: '#1c5bd9',
        'accent-2': '#1d4ab0',
        'accent-light': '#4c9af8',
        'accent-soft': '#dbedfe',
        up: '#2f9e44',
        'up-soft': '#e7f6ec',
        down: '#e03131',
        'down-soft': '#fdeaea',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'SF Pro Text', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      borderRadius: { card: '20px', inner: '14px' },
      boxShadow: {
        card: '0 1px 2px rgba(21,26,37,0.04), 0 1px 3px rgba(21,26,37,0.03)',
        lift: '0 4px 16px -4px rgba(21,26,37,0.10), 0 2px 6px -2px rgba(21,26,37,0.06)',
        focus: '0 0 0 3px rgba(28,91,217,0.18)',
      },
      keyframes: {
        rise: { '0%': { opacity: 0, transform: 'translateY(8px)' }, '100%': { opacity: 1, transform: 'none' } },
        breathe: { '0%,100%': { opacity: 1 }, '50%': { opacity: 0.3 } },
      },
      animation: {
        rise: 'rise .5s cubic-bezier(.16,1,.3,1) both',
        breathe: 'breathe 2.4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
