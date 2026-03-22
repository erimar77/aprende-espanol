import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Use CSS variables with RGB format for opacity support
        primary: {
          DEFAULT: 'rgb(var(--primary) / <alpha-value>)',
          foreground: 'rgb(var(--primary-foreground) / <alpha-value>)',
          50: 'rgb(var(--primary) / 0.05)',
          100: 'rgb(var(--primary) / 0.1)',
          200: 'rgb(var(--primary) / 0.2)',
          300: 'rgb(var(--primary) / 0.4)',
          400: 'rgb(var(--primary) / 0.7)',
          500: 'rgb(var(--primary) / <alpha-value>)',
          600: 'rgb(var(--primary) / <alpha-value>)',
          700: 'rgb(var(--primary) / <alpha-value>)',
          800: 'rgb(var(--primary) / <alpha-value>)',
          900: 'rgb(var(--primary) / <alpha-value>)',
        },
        secondary: {
          DEFAULT: 'rgb(var(--secondary) / <alpha-value>)',
          foreground: 'rgb(var(--secondary-foreground) / <alpha-value>)',
          50: 'rgb(var(--secondary) / 0.05)',
          100: 'rgb(var(--secondary) / 0.1)',
          200: 'rgb(var(--secondary) / 0.2)',
          300: 'rgb(var(--secondary) / 0.4)',
          400: 'rgb(var(--secondary) / 0.7)',
          500: 'rgb(var(--secondary) / <alpha-value>)',
          600: 'rgb(var(--secondary) / <alpha-value>)',
          700: 'rgb(var(--secondary) / <alpha-value>)',
          800: 'rgb(var(--secondary) / <alpha-value>)',
          900: 'rgb(var(--secondary) / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'rgb(var(--accent) / <alpha-value>)',
          foreground: 'rgb(var(--accent-foreground) / <alpha-value>)',
          50: 'rgb(var(--accent) / 0.05)',
          100: 'rgb(var(--accent) / 0.1)',
          200: 'rgb(var(--accent) / 0.2)',
          300: 'rgb(var(--accent) / 0.4)',
          400: 'rgb(var(--accent) / 0.7)',
          500: 'rgb(var(--accent) / <alpha-value>)',
          600: 'rgb(var(--accent) / <alpha-value>)',
          700: 'rgb(var(--accent) / <alpha-value>)',
          800: 'rgb(var(--accent) / <alpha-value>)',
          900: 'rgb(var(--accent) / <alpha-value>)',
        },
        background: 'rgb(var(--background) / <alpha-value>)',
        foreground: 'rgb(var(--foreground) / <alpha-value>)',
        card: {
          DEFAULT: 'rgb(var(--card) / <alpha-value>)',
          foreground: 'rgb(var(--card-foreground) / <alpha-value>)',
        },
        muted: {
          DEFAULT: 'rgb(var(--muted) / <alpha-value>)',
          foreground: 'rgb(var(--muted-foreground) / <alpha-value>)',
        },
        border: 'rgb(var(--border) / <alpha-value>)',
        cream: '#FFF8F0',
        charcoal: '#1C1C1E',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
