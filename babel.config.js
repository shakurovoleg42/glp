module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        targets: "> 0.25%, not dead",
        useBuiltIns: "entry",
        corejs: 3,
      },
    ],
  ],
  plugins: ["@babel/plugin-transform-modules-commonjs"],
};
