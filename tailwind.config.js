/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#eff6ff',
                    100: '#dbeafe',
                    200: '#bfdbfe',
                    300: '#93c5fd',
                    400: '#60a5fa',
                    500: '#3b82f6',
                    600: '#2563eb',
                    700: '#1d4ed8',
                    800: '#1e40af',
                    900: '#1e3a8a',
                },
                secondary: {
                    50: '#eef2ff',
                    100: '#e0e7ff',
                    200: '#c7d2fe',
                    300: '#a5b4fc',
                    400: '#818cf8',
                    500: '#6366f1',
                    600: '#4f46e5',
                    700: '#4338ca',
                    800: '#3730a3',
                    900: '#312e81',
                },
                // Anti-Gravity Palette
                'space-black': '#050510',
                'neon-blue': '#00f3ff',
                'neon-purple': '#bd00ff',
                'hologram': 'rgba(0, 243, 255, 0.1)',
            },
            boxShadow: {
                'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
                'neon': '0 0 10px rgba(0, 243, 255, 0.5), 0 0 20px rgba(0, 243, 255, 0.3)',
                'neon-purple': '0 0 10px rgba(189, 0, 255, 0.5), 0 0 20px rgba(189, 0, 255, 0.3)',
            },
            animation: {
                'fade-in': 'fadeIn 0.3s ease-in-out',
                'slide-in': 'slideIn 0.3s ease-out',
                'levitate': 'levitate 6s ease-in-out infinite',
                'glow': 'glow 2s ease-in-out infinite alternate',
                'float': 'float 20s linear infinite',
                'float-6s': 'levitate 6s ease-in-out infinite', // Alias for clarity based on spec
                'pulse-fast': 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'spin-slow': 'spin 8s linear infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideIn: {
                    '0%': { transform: 'translateY(-10px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                levitate: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-15px)' },
                },
                glow: {
                    'from': { boxShadow: '0 0 10px rgba(0, 243, 255, 0.2)' },
                    'to': { boxShadow: '0 0 20px rgba(0, 243, 255, 0.6), 0 0 10px rgba(189, 0, 255, 0.4)' },
                },
                float: {
                    '0%': { transform: 'translate(0, 0) rotate(0deg)' },
                    '33%': { transform: 'translate(30px, -50px) rotate(10deg)' },
                    '66%': { transform: 'translate(-20px, 20px) rotate(-5deg)' },
                    '100%': { transform: 'translate(0, 0) rotate(0deg)' },
                },
            },
            backdropBlur: {
                'xs': '2px',
            },
        },
    },
    plugins: [],
}
