// `import '../global.css'` is how the Tailwind/NativeWind entry gets pulled into
// the bundle. Expo's generated expo-env.d.ts declares this, but that file is
// gitignored and only written by an `expo` command, so a clean checkout — CI,
// most of all — does not have it. TypeScript 6 reports the gap as TS2882, where
// 5.x accepted an undeclared side-effect import silently.
declare module '*.css';
