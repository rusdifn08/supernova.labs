/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
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
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['ui-monospace', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
};
