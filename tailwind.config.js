/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Professional Brand Colors
                brand: {
                    50: '#EEF2FF',
                    100: '#E0E7FF',
                    200: '#C7D2FE',
                    300: '#A5B4FC',
                    400: '#818CF8',
                    500: '#6366F1',
                    600: '#4F46E5',
                    700: '#2E5DDE', // Accent Blue
                    800: '#2648C4',
                    900: '#1F3A93', // Brand Blue
                },
                // Accent Colors (complementary to brand)
                accent: {
                    50: '#F0F9FF',
                    100: '#E0F2FE',
                    200: '#BAE6FD',
                    300: '#7DD3FC',
                    400: '#38BDF8',
                    500: '#0EA5E9',
                    600: '#0284C7',
                    700: '#0369A1',
                    800: '#075985',
                    900: '#0C4A6E',
                },
                // Neutral Colors
                slate: {
                    50: '#F8FAFC',
                    100: '#F1F5F9',
                    200: '#E2E8F0',
                    300: '#CBD5E1',
                    400: '#94A3B8',
                    500: '#64748B',
                    600: '#475569',
                    700: '#334155',
                    800: '#1E293B',
                    900: '#0F172A',
                    950: '#0F172A', // Dark Slate
                },
                // Semantic Colors
                success: {
                    50: '#ECFDF5',
                    100: '#D1FAE5',
                    200: '#A7F3D0',
                    300: '#6EE7B7',
                    400: '#34D399',
                    500: '#10B981',
                    600: '#059669',
                    700: '#047857',
                    800: '#065F46',
                    900: '#065F46',
                },
                warning: {
                    50: '#FFFBEB',
                    100: '#FEF3C7',
                    200: '#FDE68A',
                    300: '#FCD34D',
                    400: '#FBBF24',
                    500: '#F59E0B',
                    600: '#D97706',
                    700: '#B45309',
                    800: '#92400E',
                    900: '#78350F',
                },
                error: {
                    50: '#FEF2F2',
                    100: '#FEE2E2',
                    200: '#FECACA',
                    300: '#FCA5A5',
                    400: '#F87171',
                    500: '#EF4444',
                    600: '#DC2626',
                    700: '#B91C1C',
                    800: '#991B1B',
                    900: '#7F1D1D',
                },
                info: {
                    50: '#EFF6FF',
                    100: '#DBEAFE',
                    200: '#BFDBFE',
                    300: '#93C5FD',
                    400: '#60A5FA',
                    500: '#3B82F6',
                    600: '#2563EB',
                    700: '#1D4ED8',
                    800: '#1E40AF',
                    900: '#1E3A8A',
                },
                teal: {
                    500: '#00A8A8',
                    600: '#008C8C',
                },
                // Premium Colors
                premium: {
                    cyan: '#00D9FF',
                    gold: '#FBBF24',
                    purple: '#7C3AED',
                    coral: '#FF6B6B',
                },
            },
            backgroundImage: {
                'gradient-primary': 'linear-gradient(135deg, #2E5DDE 0%, #00D9FF 100%)',
                'gradient-secondary': 'linear-gradient(135deg, #7C3AED 0%, #2E5DDE 100%)',
                'gradient-success': 'linear-gradient(135deg, #10B981 0%, #14B8A6 100%)',
                'gradient-gold': 'linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%)',
                'gradient-animated': 'linear-gradient(-45deg, #2E5DDE, #00D9FF, #7C3AED, #1F3A93)',
            },
            boxShadow: {
                'brand': '0 2px 8px rgba(31, 58, 147, 0.15)',
                'card': '0 1px 3px rgba(0, 0, 0, 0.08)',
                'card-hover': '0 4px 12px rgba(0, 0, 0, 0.12)',
                'button': '0 2px 4px rgba(0, 0, 0, 0.1)',
                'modal': '0 10px 40px rgba(0, 0, 0, 0.15)',
                'toast': '0 4px 12px rgba(0, 0, 0, 0.15)',
                // Premium Shadows
                'premium': '0 20px 40px rgba(31, 58, 147, 0.3)',
                'glow': '0 0 20px rgba(0, 217, 255, 0.5)',
                'glow-lg': '0 0 40px rgba(0, 217, 255, 0.6)',
                'deep': '0 20px 60px rgba(0, 0, 0, 0.3)',
                'inner-glow': 'inset 0 0 20px rgba(0, 217, 255, 0.3)',
            },
            borderRadius: {
                'brand': '8px',
                'card': '12px',
                'premium': '24px',
            },
            animation: {
                'fade-in': 'fadeIn 200ms ease-in-out',
                'slide-up': 'slideUp 300ms ease-out',
                'slide-in': 'slideIn 200ms ease-out',
                'scale-in': 'scaleIn 200ms ease-out',
                // Premium Animations
                'fade-in-up': 'fadeInUp 0.6s ease-out',
                'fade-in-down': 'fadeInDown 0.6s ease-out',
                'zoom-in': 'zoomFadeIn 0.5s ease-out',
                'slide-left': 'slideLeft 0.6s ease-in-out',
                'slide-right': 'slideRight 0.6s ease-in-out',
                'glow-pulse': 'glowPulse 2s ease-in-out infinite',
                'float': 'float 3s ease-in-out infinite',
                'spin-slow': 'spin 3s linear infinite',
                'shimmer': 'shimmer 2s infinite',
                'gradient-shift': 'gradientShift 15s ease infinite',
                'bounce-subtle': 'bounceSubtle 2s ease-in-out infinite',
                'blob': 'blob 7s ease-in-out infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(10px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                slideIn: {
                    '0%': { transform: 'translateX(-10px)', opacity: '0' },
                    '100%': { transform: 'translateX(0)', opacity: '1' },
                },
                scaleIn: {
                    '0%': { transform: 'scale(0.95)', opacity: '0' },
                    '100%': { transform: 'scale(1)', opacity: '1' },
                },
                // Premium Keyframes
                fadeInUp: {
                    '0%': { opacity: '0', transform: 'translateY(30px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                fadeInDown: {
                    '0%': { opacity: '0', transform: 'translateY(-30px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                zoomFadeIn: {
                    '0%': { opacity: '0', transform: 'scale(0.95)' },
                    '100%': { opacity: '1', transform: 'scale(1)' },
                },
                slideLeft: {
                    '0%': { transform: 'translateX(100%)', opacity: '0' },
                    '100%': { transform: 'translateX(0)', opacity: '1' },
                },
                slideRight: {
                    '0%': { transform: 'translateX(-100%)', opacity: '0' },
                    '100%': { transform: 'translateX(0)', opacity: '1' },
                },
                glowPulse: {
                    '0%, 100%': { boxShadow: '0 0 0 0 rgba(0, 217, 255, 0.7)' },
                    '50%': { boxShadow: '0 0 0 15px rgba(0, 217, 255, 0)' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
                shimmer: {
                    '0%': { backgroundPosition: '-1000px 0' },
                    '100%': { backgroundPosition: '1000px 0' },
                },
                gradientShift: {
                    '0%': { backgroundPosition: '0% 50%' },
                    '50%': { backgroundPosition: '100% 50%' },
                    '100%': { backgroundPosition: '0% 50%' },
                },
                bounceSubtle: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                blob: {
                    '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
                    '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
                    '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
                },
            },
            fontFamily: {
                sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
            },
        },
    },
    plugins: [],
}

