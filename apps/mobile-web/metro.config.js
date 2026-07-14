const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// Workspace packages (@repo/*) are symlinked by pnpm; Metro needs this to
// follow them. EXPO_USE_METRO_WORKSPACE_ROOT (set in package.json's dev
// scripts) is what makes getDefaultConfig watch/serve from the monorepo
// root instead of just this app.
config.resolver.unstable_enableSymlinks = true;

module.exports = withNativeWind(config, { input: './global.css' });
