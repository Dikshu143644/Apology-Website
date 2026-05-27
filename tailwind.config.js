/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ["var(--font-serif)", "Cinzel", "Georgia", "serif"],
        sans: ["var(--font-sans)", "Poppins", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "monospace"],
        cursive: ["var(--font-cursive)", "Great Vibes", "cursive"],
        cormorant: ["var(--font-cormorant)", "Cormorant Garamond", "serif"],
      },
    },
  },
  plugins: [],
}
