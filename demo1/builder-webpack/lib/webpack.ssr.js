const merge = require('webpack-merge');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const HtmlWebpackTagsPlugin = require('html-webpack-tags-plugin');
const baseConfig = require('./webpack.base');

const ssrConfig = {
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.(c|le)ss$/,
        use: 'ignore-loader',
      },
    ],
  },
  plugins: [
    new OptimizeCSSAssetsPlugin(),
    new HtmlWebpackTagsPlugin({
      scripts: [
        {
          path: 'https://cdn.bootcss.com/react/16.8.6/umd/react.production.min.js',
          external: {
            packageName: 'react',
            variableName: 'React',
          },
        },
        {
          path: 'https://cdn.bootcss.com/react-dom/16.8.6/umd/react-dom.production.min.js',
          external: {
            packageName: 'react-dom',
            variableName: 'ReactDOM',
          },
        },
      ],
    }),
  ],
  optimization: {
    splitChunks: {
      minSize: 0,
      cacheGroups: {
        commons: {
          name: 'commons',
          chunks: 'all',
          minChunks: 2,
        },
      },
    },
  },
};

module.exports = merge(baseConfig, ssrConfig);
