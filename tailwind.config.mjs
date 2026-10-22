/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  corePlugins: {
    container: false,
  },
  theme: {
    extend: {
      colors: {
        paper: 'var(--paper)',
        surface: 'var(--surface)',
        ink: 'var(--ink)',
        'ink-2': 'var(--ink-2)',
        muted: 'var(--muted)',
        'muted-2': 'var(--muted-2)',
        blue: '#2563eb',
        bright: 'var(--bright)',
        'bright-hover': 'var(--bright-hover)',
        cyan: 'var(--cyan)',
        purple: 'var(--purple)',
        line: 'var(--line)',
        'line-2': 'var(--line-2)',
        wa: 'var(--wa)',
        'wa-hover': 'var(--wa-hover)',
        // Supernova Labs Brand Design System
        pearl: '#F8FAFC',
        'lavender-snow': '#F5F3FF',
        'electric-cyan': '#06B6D4',
        'vivid-purple': '#7C3AED',
        'hot-magenta': '#D946EF',
        'luminous-pink': '#EC4899',
        navy: '#0F172A',
        'slate-soft': '#64748B',
      },
      boxShadow: {
        glass: '0 8px 30px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.02)',
        'glass-lg': '0 20px 60px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.03)',
        'glow-purple': '0 15px 40px rgba(124,58,237,0.4)',
        'glow-cyan': '0 15px 40px rgba(6,182,212,0.35)',
        'glow-pink': '0 10px 30px rgba(236,72,153,0.35)',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
      },
      animation: {
        shimmer: 'shimmer 4s linear infinite',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['ui-monospace', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
};
