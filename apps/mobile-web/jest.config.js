module.exports = {
  preset: 'jest-expo',
  transformIgnorePatterns: [
    'node_modules/(?!\\.pnpm|((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg|nativewind|react-native-css-interop)',
  ],
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/e2e/'],
  setupFilesAfterEnv: ['./jest.setup.js'],
  // jest-expo's first render pays a cold-start compilation cost that, combined
  // with --coverage instrumentation on a loaded CI runner, can exceed the
  // default 5000ms — bumped so that's headroom, not a real regression signal.
  testTimeout: 15000,
};
