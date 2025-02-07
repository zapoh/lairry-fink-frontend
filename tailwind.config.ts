import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FF0F7B',
          50: '#FFE5F0',
          100: '#FFD1E6',
          200: '#FFA8D1',
          300: '#FF7FBD',
          400: '#FF47A9',
          500: '#FF0F7B',
          600: '#CC0C62',
          700: '#990949',
          800: '#660631',
          900: '#330318',
        },
        accent: '#00F0FF',
        background: {
          DEFAULT: '#1A1A2E',
          light: '#252542',
          dark: '#12121E',
        },
      },
    },
  },
  plugins: [],
}

export default config