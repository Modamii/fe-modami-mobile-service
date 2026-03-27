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
  ],
};
