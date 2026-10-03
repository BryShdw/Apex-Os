/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
        ss: {
          bg: '#15181e',
          light: '#1b1f28',
          dark: '#0f1115',
          cyan: '#06b6d4',
          silver: '#e2e8f0',
          crimson: '#dc2626',
          gold: '#f59e0b',
          void: '#090a0c',
          purple: '#8b5cf6',
        }
      },
      boxShadow: {
        'ss-outset': '6px 6px 14px #0f1115, -6px -6px 14px #1b1f28',
        'ss-outset-hover': '8px 8px 18px #0f1115, -8px -8px 18px #1b1f28',
        'ss-inset': 'inset 4px 4px 8px #0f1115, inset -4px -4px 8px #1b1f28',
        'ss-cyan-glow': '0 0 12px rgba(6, 182, 212, 0.4)',
        'ss-gold-glow': '0 0 15px rgba(245, 158, 11, 0.4)',
      },
      fontFamily: {
        serif: ['Cinzel', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
        sans: ['Inter', 'sans-serif'],
      }
    }
  }
}