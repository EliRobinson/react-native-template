// Shared Tailwind/NativeWind preset — import in each app's tailwind.config.js:
//   presets: [require('@repo/config/tailwind')]
/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4F46E5',
          light: '#6366F1',
          dark: '#4338CA',
        },
        surface: '#FFFFFF',
        muted: '#6B7280',
      },
      spacing: {
        18: '4.5rem',
      },
    },
  },
  plugins: [],
};
