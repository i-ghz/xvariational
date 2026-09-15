/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#050506',
        panel: '#0e0e11',
        'panel-2': '#141419',
        line: 'rgba(255,255,255,0.08)',
        text: '#f5f5f7',
        muted: '#a1a1aa',
        dim: '#6e6e76',
        accent: '#3B82F6',
        up: '#34d399',
        down: '#f87171',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 0 rgba(255,255,255,0.04) inset, 0 20px 60px -30px rgba(0,0,0,0.8)',
        glow: '0 0 0 1px rgba(59,130,246,0.35), 0 0 40px -10px rgba(59,130,246,0.5)',
      },
      keyframes: {
        rise: { '0%': { opacity: 0, transform: 'translateY(12px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
      },
      animation: { rise: 'rise .6s cubic-bezier(.2,.7,.2,1) both' },
    },
  },
  plugins: [],
}
