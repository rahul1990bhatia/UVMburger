/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Outfit', 'sans-serif'],
                mono: ['Fira Code', 'monospace'],
            },
            colors: {
                burger: {
                    bun: '#F59E0B',   // Amber-500
                    meat: '#78350F',  // Amber-900
                    leaf: '#10B981',  // Emerald-500
                    cheese: '#FCD34D', // Amber-300
                    tomato: '#EF4444', // Red-500
                },
                dark: {
                    bg: '#0F172A',    // Slate-900
                    card: '#1E293B',  // Slate-800
                    border: '#334155', // Slate-700
                }
            },
            animation: {
                'float': 'float 6s ease-in-out infinite',
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-20px)' },
                }
            }
        },
    },
    plugins: [],
}
