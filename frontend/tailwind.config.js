/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        black:    '#000000',
        white:    '#FFFFFF',
        charcoal: '#111111',
        hover:    '#1a1a1a',
        border:   '#333333',
        muted:    '#999999',
        orange:   '#FF4D00',
        dim:      '#666666',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
      letterSpacing: {
        tighter: '-0.02em',
        tight:   '-0.01em',
        wide:    '0.05em',
      },
      borderRadius: {
        DEFAULT: '10px',
        lg: '12px',
      },
      animation: {
        'hp-drain': 'hpDrain 0.6s ease-out',
        'fade-in':  'fadeIn 0.2s ease-out',
        'slide-up': 'slideUp 0.25s ease-out',
        'pulse-orange': 'pulseOrange 1s ease-in-out infinite',
      },
      keyframes: {
        hpDrain:    { from: { width: '100%' } },
        fadeIn:     { from: { opacity: 0 } },
        slideUp:    { from: { opacity: 0, transform: 'translateY(8px)' } },
        pulseOrange:{ '0%,100%': { opacity: 1 }, '50%': { opacity: 0.6 } },
      },
    },
  },
  plugins: [],
}
