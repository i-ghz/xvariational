/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Variational Omni's own dark palette (gray-950 page, gray-900 cards, blue-400 accent).
        page: '#010612',
        card: '#0b101b',
        sunken: '#0f1522',
        line: '#1a2231',
        'line-2': '#2a3547',
        ink: '#e9edf1',
        muted: '#a0aec0',
        dim: '#6c829d',
        accent: '#4c9af8',
        'accent-2': '#76b3fa',
        'accent-light': '#8ec2ff',
        'accent-soft': '#0f2347',
        up: '#56c75d',
        'up-soft': '#0f2a14',
        down: '#ff6467',
        'down-soft': '#3a1215',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'SF Pro Text', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      borderRadius: { card: '12px', inner: '8px' },
      boxShadow: {
        card: '0 1px 0 rgba(255,255,255,0.025) inset, 0 1px 2px rgba(0,0,0,0.4)',
        lift: '0 10px 30px -10px rgba(0,0,0,0.7), 0 2px 8px -2px rgba(0,0,0,0.5)',
        focus: '0 0 0 3px rgba(76,154,248,0.28)',
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
