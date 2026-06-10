import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          DEFAULT: '#4f46e5',
          light: '#e0e7ff',
          dim: '#eef2ff',
          hover: '#4338ca',
        },
        success: {
          DEFAULT: '#10b981',
          dim: '#ecfdf5',
        },
        warn: {
          DEFAULT: '#d97706',
          dim: '#fffbeb',
        },
        surface: {
          base: '#f8fafc',
          low: '#f8fafc',
          mid: '#ffffff',
          high: '#f1f5f9',
          hover: '#f8fafc',
          border: '#e2e8f0',
          borderHigh: '#cbd5e1',
          borderFocus: '#94a3b8',
        },
        ink: {
          primary: '#0f172a',
          secondary: '#1e293b',
          muted: '#64748b',
          dim: '#94a3b8',
          ghost: '#cbd5e1',
        },
      },
      borderRadius: {
        sm: '3px',
        DEFAULT: '5px',
        md: '5px',
        lg: '8px',
      },
      borderWidth: {
        DEFAULT: '0.5px',
      },
      fontSize: {
        '2xs': ['12px', { lineHeight: '1.5', letterSpacing: '0' }],
        xs:   ['13px', { lineHeight: '1.5', letterSpacing: '0' }],
        sm:   ['14px', { lineHeight: '1.6', letterSpacing: '0' }],
        base: ['15px', { lineHeight: '1.6', letterSpacing: '-0.1px' }],
        md:   ['16px', { lineHeight: '1.6', letterSpacing: '-0.2px' }],
        lg:   ['17px', { lineHeight: '1.5', letterSpacing: '-0.3px' }],
        xl:   ['20px', { lineHeight: '1.3', letterSpacing: '-0.4px' }],
        '2xl':['24px', { lineHeight: '1.2', letterSpacing: '-0.6px' }],
        '3xl':['34px', { lineHeight: '1.1', letterSpacing: '-1px' }],
        display: ['56px', { lineHeight: '1.0', letterSpacing: '-2px' }],
      },
      fontWeight: {
        normal: '500',
        medium: '700',
      },
    },
  },
  plugins: [],
}

export default config
