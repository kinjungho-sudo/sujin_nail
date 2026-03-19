/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        status: {
          open: '#22c55e',
          'open-bg': '#f0fdf4',
          inProgress: '#f59e0b',
          'inProgress-bg': '#fffbeb',
          completed: '#3b82f6',
          'completed-bg': '#eff6ff',
          cancelled: '#ef4444',
          'cancelled-bg': '#fef2f2',
        },
        category: {
          bug: '#ef4444',
          'bug-bg': '#fef2f2',
          feature: '#8b5cf6',
          'feature-bg': '#f5f3ff',
          performance: '#f59e0b',
          'performance-bg': '#fffbeb',
          security: '#dc2626',
          'security-bg': '#fef2f2',
          design: '#ec4899',
          'design-bg': '#fdf2f8',
          data: '#06b6d4',
          'data-bg': '#ecfeff',
        },
      },
      fontFamily: {
        sans: ['Pretendard', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
}
