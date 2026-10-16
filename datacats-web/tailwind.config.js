/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        light: {
          surface: '#F8FAFC',
          card: '#FFFFFF',
          text: {
            primary: '#0F172A',
            secondary: '#475569'
          }
        },
        dark: {
          surface: '#0F172A',
          card: '#1E293B',
          text: {
            primary: '#F8FAFC',
            secondary: '#94A3B8'
          }
        },
        brand: {
          gold: '#F59E0B',
          amber: '#FBBF24',
          cyan: '#06B6D4'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif']
      },
      transitionTimingFunction: {
        bounce: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
      },
      animation: {
        'cat-swipe': 'swipe 0.3s ease-in-out',
        'float': 'float 3s ease-in-out infinite',
        'bounce-subtle': 'bounceSubtle 0.3s ease-out',
        'lift': 'lift 0.3s ease-out'
      },
      keyframes: {
        swipe: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '50%': { transform: 'rotate(-15deg)' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        bounceSubtle: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.02)' },
          '100%': { transform: 'scale(1.01)' }
        },
        lift: {
          '0%': { transform: 'translateY(0) scale(1)' },
          '100%': { transform: 'translateY(-4px) scale(1.02)' }
        }
      }
    }
  },
  plugins: []
}

