// Shared Tailwind/NativeWind preset — import in each app's tailwind.config.js:
//   presets: [require('@repo/config/tailwind')]
//
// Every value here comes from @elirobinson/tokens via tokens.generated.js.
// Regenerate with `pnpm tokens:sync` after bumping that package; nothing in
// this file needs hand-editing when a token changes.
const tokens = require('./tokens.generated.js');

// Colours resolve through CSS variables rather than literal hex so one class
// (`bg-surface`) picks up the dark value automatically. The variables are
// declared in tokens.generated.css, which the app imports from global.css.
const colors = Object.fromEntries(
  Object.keys(tokens.colors).map((name) => [name, `var(--ds-${name})`]),
);

/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors,
      spacing: tokens.spacing,
      borderRadius: tokens.borderRadius,
      fontSize: tokens.fontSize,
      fontWeight: tokens.fontWeight,
      lineHeight: tokens.lineHeight,
      letterSpacing: tokens.letterSpacing,
      zIndex: tokens.zIndex,
      transitionDuration: tokens.transitionDuration,
      maxWidth: tokens.maxWidth,
    },
  },
  plugins: [],
};
