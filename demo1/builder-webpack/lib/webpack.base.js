
const path = require('path');
const glob = require('glob');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const autoprefixer = require('autoprefixer');

const projectRoot = process.cwd(); // 设置工作目录变量

const setMPA = () => {
  const entry = {};
  const HtmlWebpackPlugins = [];

  const entryFiles = glob.sync(path.join(projectRoot, './src/*/index.js'));

  entryFiles.forEach((pagePath) => {
    const pageName = pagePath.match(/src\/(.*)\/index\.js/)[1];
    entry[pageName] = pagePath;

    HtmlWebpackPlugins.push(
      new HtmlWebpackPlugin({
        filename: `${pageName}.html`,
        template: path.join(projectRoot, `src/${pageName}/index.html`),
        chunks: ['vendors', 'commons', pageName],
        minify: {
          collapseWhitespace: true,
          preserveLineBreaks: false,
          minifyCSS: true,
          minifyJS: true,
        },
      }),
    );
  });

  return {
    entry,
    HtmlWebpackPlugins,
  };
};

const { entry, HtmlWebpackPlugins } = setMPA();

module.exports = {
  entry,
  output: {
    path: path.join(projectRoot, 'dist'),
    filename: '[name]_[chunkhash:8].js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          'babel-loader',
        ],
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
        ],
      },
      {
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: [autoprefixer],
            },
          },
          {
            loader: 'px2rem-loader',
            options: {
              remUnit: 75, // 1rem = 75px
              remPrecesion: 8, // 转为rem后，小数位个数
            },
          },
          'less-loader',
        ],
      },
      {
        test: /\.(png|jpg|gif|jpeg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10240, // 小于 10KB 会转为 base64 URIs，否则内部会自动调用 file-loader
              name: '[name]_[hash:8].[ext]',
            },
          },
        ],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name]_[hash:8].[ext]',
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name]_[contenthash:8].css',
    }),
    ...HtmlWebpackPlugins,
    new FriendlyErrorsWebpackPlugin(),
    function errorPlugin() {
      this.hooks.done.tap('done', (stats) => {
        if (
          stats.compilation.errors
          && stats.compilation.errors.length
          && process.argv.indexOf('---watch') === -1
        ) {
          process.exit(1);
        }
      });
    },
  ],
  stats: 'errors-only',
};
