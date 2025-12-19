/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: '#040812',
                surface: '#0B1221',
                'surface-highlight': '#151e32',
                primary: '#3B82F6', // Standard blue backup
                'var-blue': '#4F46E5', // Indigo-ish
                'var-cyan': '#00F0FF', // Electric Cyan
                'var-dark': '#020617',
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'], // Tech feel
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'hero-glow': 'conic-gradient(from 180deg at 50% 50%, #00F0FF 0deg, #3B82F6 180deg, #00F0FF 360deg)',
            }
        },
    },
    plugins: [],
}
