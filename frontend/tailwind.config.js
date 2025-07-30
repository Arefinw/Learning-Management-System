/** @type {import('tailwindcss').Config} */
/**
 * @file tailwind.config.js
 * @description The configuration file for Tailwind CSS.
 * @module tailwind.config
 */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#667eea',
          light: '#8e9dff',
          dark: '#4d5bbf',
          gradientStart: '#667eea',
          gradientEnd: '#764ba2', // Example: #667eea -> #764ba2
        },
        secondary: {
          DEFAULT: '#f093fb',
          light: '#f5b5fd',
          dark: '#c074cc',
          gradientStart: '#f093fb',
          gradientEnd: '#f5576c', // Example: #f093fb -> #f5576c
        },
        neutral: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
        success: '#10b981',
        warning: '#f59e0b',
        danger: '#ef4444',
        info: '#3b82f6',
      },
      spacing: {
        '4': '4px',
        '8': '8px',
        '12': '12px',
        '16': '16px',
        '24': '24px',
        '32': '32px',
        '48': '48px',
        '64': '64px',
      },
      fontFamily: {
        sans: ['Inter', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 4px 6px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.02)',
      }
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false, // Disable Tailwind's base styles to prevent conflicts with Ant Design
  },
}