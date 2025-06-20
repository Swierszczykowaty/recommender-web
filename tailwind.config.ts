import type { Config } from 'tailwindcss'

const config: Config = {
    content: ['./src/**/*.{ts,tsx,js,jsx,html}'],
  theme: {
    extend: {
      animation: {
        'float-slow': 'float 10s ease-in-out infinite',
        'float-medium': 'float 7s ease-in-out infinite',
        'float-fast': 'float 5s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-40px)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
