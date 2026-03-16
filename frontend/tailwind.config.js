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
                    DEFAULT: '#EBC04D',
                    50: '#FDF8E8',
                    100: '#FBF0C7',
                    200: '#F7E192',
                    300: '#F3D25C',
                    400: '#EFC336',
                    500: '#EBC04D',
                    600: '#D4A834',
                    700: '#B08B1F',
                    800: '#8C6F0F',
                    900: '#6B5408'
                },
                secondary: {
                    DEFAULT: '#2E5D9B',
                    50: '#EBF2FB',
                    100: '#D1E2F5',
                    200: '#A8C5EA',
                    300: '#7BA8DF',
                    400: '#528BD4',
                    500: '#2E5D9B',
                    600: '#25508A',
                    700: '#1E4078',
                    800: '#173166',
                    900: '#102254'
                },
                manila: '#D9B98E',
                leather: {
                    DEFAULT: '#8C6246',
                    50: '#F5F1ED',
                    100: '#E8DDD2',
                    200: '#D4BBA5',
                    300: '#C09978',
                    400: '#AC7B5F',
                    500: '#8C6246',
                    600: '#7A543C',
                    700: '#684632',
                    800: '#563828',
                    900: '#442A1E'
                },
                olive: {
                    DEFAULT: '#A8A640',
                    50: '#F6F5E8',
                    100: '#EDEBC5',
                    200: '#DBD78B',
                    300: '#C9C351',
                    400: '#B7B046',
                    500: '#A8A640',
                    600: '#949234',
                    700: '#7F7E28',
                    800: '#6A691C',
                    900: '#555410'
                }
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                mono: ['JetBrains Mono', 'Monaco', 'Consolas', 'monospace']
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-in-out',
                'slide-up': 'slideUp 0.3s ease-out',
                'float': 'float 6s ease-in-out infinite',
                'glow': 'glow 2s ease-in-out infinite alternate',
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite'
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' }
                },
                slideUp: {
                    '0%': { transform: 'translateY(10px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' }
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-10px)' }
                },
                glow: {
                    'from': { boxShadow: '0 0 20px rgba(235, 192, 77, 0.3)' },
                    'to': { boxShadow: '0 0 30px rgba(235, 192, 77, 0.6)' }
                }
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'mesh': 'url("data:image/svg+xml,%3csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3e%3cg fill=\'none\' fill-rule=\'evenodd\'%3e%3cg fill=\'%23EBC04D\' fill-opacity=\'0.03\'%3e%3ccircle cx=\'30\' cy=\'30\' r=\'2\'/%3e%3c/g%3e%3c/g%3e%3c/svg%3e")'
            },
            backdropBlur: {
                xs: '2px'
            }
        },
    },
    plugins: [],
}
