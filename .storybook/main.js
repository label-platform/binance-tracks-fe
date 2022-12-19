const path = require('path');
module.exports = {
  stories: [
    "../src/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
  ],
  framework: "@storybook/react",
  core: {
    "builder": "@storybook/builder-webpack5"
  },
  staticDirs: [path.resolve('./public')],
  webpackFinal: async (config) => {
    return {
      ...config,
      resolve: {
        ...config.resolve,
        alias: {
          ...config.resolve?.alias,
          '@components': path.resolve('./src/components'),
          '@constants': path.resolve('./src/constants'),
          '@styles': path.resolve('./styles'),
          '@icons': path.resolve('./src/icons'),
          '@emotion/core': path.resolve('./node_modules/@emotion/react'),
          'src': path.resolve('./src'),
        },
        roots: [
          path.resolve(__dirname, '../public'),
          'node_modules'
        ]
      }
    }
  }
}