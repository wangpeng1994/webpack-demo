const path = require('path');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: {
    vendor: ['react', 'react-dom']
  },
  output: {
    filename: '[name].[hash].dll.js',
    path: path.join(__dirname, 'dll-build/vendor'),
    library: '[name]_[hash]' // 与 output.library 的选项相结合可以暴露出 (也叫做放入全局域) dll 函数
  },
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.DllPlugin({
      name: '[name]_[hash]', // 暴露出的 dll 的函数名
      path: path.join(__dirname, 'dll-build/vendor/[name]-manifest.json') // manifest json 文件的绝对路径 (输出文件)
    })
  ]
};
