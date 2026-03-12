/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#EBC04D',
                secondary: '#2E5D9B',
                manila: '#D9B98E',
                leather: '#8C6246',
                olive: '#A8A640',
            }
        },
    },
    plugins: [],
}
