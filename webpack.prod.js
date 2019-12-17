'user strict';

const glob = require('glob');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HTMLInlineCSSWebpackPlugin = require('html-inline-css-webpack-plugin').default;
const webpack = require('webpack');

const setMPA = () => {
  const entry = {};
  const HtmlWebpackPlugins = [];

  const entryFiles = glob.sync(path.join(__dirname, './src/*/index.js'));

  entryFiles.forEach((pagePath, index) => {
    const pageName = pagePath.match(/src\/(.*)\/index\.js/)[1];
    entry[pageName] = pagePath;

    HtmlWebpackPlugins.push(
      new HtmlWebpackPlugin({
        filename: `${pageName}.html`,
        template: path.join(__dirname, `src/${pageName}/index.html`),
        chunks: ['vendors', 'commons', pageName],
        minify: {
          collapseWhitespace: true,
          preserveLineBreaks: false,
          minifyCSS: true,
          minifyJS: true
        }
      })
    );
  });

  return {
    entry,
    HtmlWebpackPlugins
  };
}

const { entry, HtmlWebpackPlugins } = setMPA();

module.exports = {
  entry,
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name]_[chunkhash:8].js',
  },
  mode: 'none',
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader'
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader'
        ]
      },
      {
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: [require('autoprefixer')]
            }
          },
          {
            loader: 'px2rem-loader',
            options: {
              remUnit: 75, // 1rem = 75px
              remPrecesion: 8 // 转为rem后，小数位个数
            }
          },
          'less-loader'
        ]
      },
      {
        test: /\.(png|jpg|gif|jpeg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10240, // 小于 10KB 会转为 base64 URIs，否则内部会自动调用 file-loader 
              name: '[name]_[hash:8].[ext]'
            }
          }
        ]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name]_[hash:8].[ext]'
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name]_[contenthash:8].css'
    }),
    new OptimizeCSSAssetsPlugin(), // 会在构建时默认寻找 .css 文件并使用 cssnamo 压缩（可配置）
    ...HtmlWebpackPlugins,
    new HTMLInlineCSSWebpackPlugin(),
    new CleanWebpackPlugin(),
    new webpack.optimize.ModuleConcatenationPlugin()
  ],
  optimization: {
    splitChunks: {
      minSize: 0,
      cacheGroups: {
        vendors: {
          test: /(react|react-dom)/,
          name: 'vendors',
          chunks: 'all'
        },
        commons: {
          name: 'commons',
          chunks: 'all',
          minChunks: 2
        }
      }
    }
  }
};
