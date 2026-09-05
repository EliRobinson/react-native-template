// Shared Tailwind/NativeWind preset — import in each app's tailwind.config.js:
//   presets: [require('nativewind/preset'), require('@repo/config/tailwind')]
//
// Every value here comes from @elirobinson/tokens via tokens.generated.js.
// Regenerate with `pnpm tokens:sync` after bumping that package; nothing in
// this file needs hand-editing when a token changes.
const plugin = require('tailwindcss/plugin');

const tokens = require('./tokens.generated.js');

// Colours resolve through CSS variables rather than literal hex so one class
// (`bg-bg`) picks up the dark value automatically.
const colors = Object.fromEntries(
  Object.keys(tokens.colors).map((name) => [name, `var(--ds-${name})`]),
);

const toVars = (colorMap) =>
  Object.fromEntries(Object.entries(colorMap).map(([name, value]) => [`--ds-${name}`, value]));

// The variables are added through addBase rather than an @import in the app's
// global.css, and that is load-bearing on native rather than a style choice.
//
// NativeWind's CSS-to-RN compiler only treats `.dark:root` as a dark
// root-variable block after it has read the `@cssInterop set darkMode class dark`
// at-rule that nativewind/preset emits from the base layer — order is strict, and
// variables parsed before that at-rule keep only their light half. An @import
// cannot satisfy that, because postcss-import only inlines imports at the top of
// the file, which is necessarily before nativewind's base layer. Moving the
// import to the bottom does not fix it either: postcss-import silently drops it
// and the tokens vanish from the build entirely.
//
// addBase sidesteps both problems. Presets apply in order, so listing
// nativewind/preset first puts its at-rule ahead of these declarations.
const tokenVariables = plugin(({ addBase }) => {
  addBase({
    ':root': toVars(tokens.colors),
    '.dark:root': toVars(tokens.darkColors),
  });
});

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
      minHeight: tokens.minHeight,
    },
  },
  plugins: [tokenVariables],
};
