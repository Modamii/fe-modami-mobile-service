module.exports = {
  presets: [
    'module:@react-native/babel-preset',
    'nativewind/babel', // preset (not plugin) — transforms className prop via react-native-css-interop
  ],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: { '@': './src' },
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
      },
    ],
    // Must be last — reanimated Babel plugin rewrites worklets for the UI thread
    'react-native-reanimated/plugin',
  ],
};
