/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#FFF8ED',
          100: '#FFF2DB',
          200: '#FFE9C2',
          300: '#FFD89A',
          400: '#FFC171',
          500: '#FFA94D',
          600: '#FF8C24',
          700: '#FA7100',
          800: '#D25C00',
          900: '#A94B00',
        },
        secondary: {
          50: '#F0FDFA',
          100: '#CCFBF1',
          200: '#99F6E4',
          300: '#5EEAD4',
          400: '#2DD4BF',
          500: '#14B8A6',
          600: '#0D9488',
          700: '#0F766E',
          800: '#115E59',
          900: '#134E4A',
        },
        accent: {
          50: '#FFF9EB',
          100: '#FFF3D6',
          200: '#FFE7AD',
          300: '#FFDA85',
          400: '#FFCE5C',
          500: '#FFC233',
          600: '#FFB60A',
          700: '#E09C00',
          800: '#B87F00',
          900: '#906200',
        },
        brown: {
          50: '#FAF8F7',
          100: '#F0E9E5',
          200: '#E1D3CB',
          300: '#D2BCB0',
          400: '#C3A495',
          500: '#B48D7A',
          600: '#A47661',
          700: '#8B6352',
          800: '#6E4F41',
          900: '#503A30',
        }
      },
      animation: {
        'bounce-slow': 'bounce 3s infinite',
        'float': 'float 3s ease-in-out infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      fontFamily: {
        'rounded': ['var(--font-rounded)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};