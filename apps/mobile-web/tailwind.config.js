/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', '../../packages/ui/src/**/*.{js,jsx,ts,tsx}'],
  // Expo Router/React Navigation set the color scheme programmatically at
  // runtime (e.g. to follow `userInterfaceStyle: "automatic"`), which
  // NativeWind's default 'media' (CSS-only) dark mode doesn't support.
  darkMode: 'class',
  presets: [require('nativewind/preset'), require('@repo/config/tailwind')],
};
