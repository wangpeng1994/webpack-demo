'user strict';

const glob = require('glob');
const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HTMLInlineCSSWebpackPlugin = require('html-inline-css-webpack-plugin').default;
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const HtmlWebpackTagsPlugin = require('html-webpack-tags-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const TerserPlugin = require('terser-webpack-plugin');

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
        chunks: ['vendors', 'commons', pageName, 'runtime~' + pageName],
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
};

const { entry, HtmlWebpackPlugins } = setMPA();

module.exports = {
  entry,
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'static/js/[name]_[chunkhash:8].js'
  },
  mode: 'production',
  // stats: 'errors-only',
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: 'thread-loader',
            options: {
              workers: 1
            }
          },
          'babel-loader',
          'eslint-loader'
        ]
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
              name: 'static/media/[name]_[hash:8].[ext]'
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
              name: 'static/media/[name]_[hash:8].[ext]'
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'static/css/[name]_[contenthash:8].css'
    }),
    new OptimizeCSSAssetsPlugin(), // 会在构建时默认寻找 .css 文件并使用 cssnamo 压缩（可配置）
    ...HtmlWebpackPlugins,
    new HTMLInlineCSSWebpackPlugin(),
    new CleanWebpackPlugin(),
    new FriendlyErrorsWebpackPlugin(),
    new webpack.DllReferencePlugin({
      manifest: require('./dll-build/vendor/vendor-manifest.json')
    }),
    new AddAssetHtmlPlugin({ filepath: path.resolve('./dll-build/vendor/vendor.*.dll.js') }),
    function () {
      this.hooks.done.tap('done', stats => {
        if (
          stats.compilation.errors &&
          stats.compilation.errors.length &&
          process.argv.indexOf('---watch') === -1
        ) {
          console.log('---build error---');
          process.exit(1); // webpack 中错误码本身是 2，现在手动修改错误码为 1
        }
      });
    }
    // new HtmlWebpackTagsPlugin({
    //   scripts: [
    //     {
    //       path: 'https://cdn.bootcss.com/react/16.8.6/umd/react.production.min.js',
    //       external: {
    //         packageName: 'react',
    //         variableName: 'React'
    //       }
    //     },
    //     {
    //       path: 'https://cdn.bootcss.com/react-dom/16.8.6/umd/react-dom.production.min.js',
    //       external: {
    //         packageName: 'react-dom',
    //         variableName: 'ReactDOM'
    //       }
    //     }
    //   ]
    // }),
    // new BundleAnalyzerPlugin()
  ],

  optimization: {
    minimizer: [
      new TerserPlugin({
        parallel: true
      })
    ],
    splitChunks: {
      minSize: 0, // 覆盖默认策略
      chunks: 'all', // 覆盖默认策略，所有的块（初始块+异步块）
      name: false, // 官方建议生产环境设置为 false，从而避免根据 chunks 和 cache group key 生成不必要的名字
      cacheGroups: { // 和默认策略合并，同时受它们的优先级控制
        vendors: {
          test: /(react|react-dom)/, // 建议仅包括核心框架和实用程序
          name: 'vendors', // 覆盖 splitChunks.name
          priority: 10 // 设置优先级高于下方的 commons，意味着优先抽取出 vendors 走人，余下的 chunks 再跟 commons 慢慢玩
          // 避免符合 vendors 条件的 chunks 刚好也符合 commons 的条件，结果被归属到 commons 中
        },
        commons: {
          name: 'commons',
          minChunks: 2 // 只要引用两次就打包为一个文件
          // priority: 0 // 自定义的 cacheGroup 默认优先级是 0
        }
      }
    },
    runtimeChunk: true // 从每个入口 chunk 中分离出 runtime chunk，利于入口 chunk 的长效缓存
  }
};
