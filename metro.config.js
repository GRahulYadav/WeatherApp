const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const { withNativeWind } = require('nativewind/metro');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const baseConfig = getDefaultConfig(__dirname);
const mergedConfig = mergeConfig(baseConfig, {
  // any custom config here if needed
});

module.exports = withNativeWind(mergedConfig, { input: './src/global.css' });
