/**
 * 测试构建是否成功
 */

const process = require('process');
const path = require('path');
const webpack = require('webpack');
const rimraf = require('rimraf');
const Mocha = require('mocha');

const mocha = new Mocha({
  timeout: '10000ms'
});

// 变更当前 node 进程的工作目录
process.chdir(path.join(__dirname, 'template'));

// 先删除输出目录
rimraf('./dist', () => {
  const prodConfig = require('../../lib/webpack.prod.js');

  webpack(prodConfig, (err, stats) => {
    if (err) {
      console.error(err);
      process.exit(2);
    }

    console.log(stats.toString({
      colors: true,
      modules: false,
      children: false
    }));

    console.log('Webpack build successfully, begin to run tests.')

    mocha.addFile(path.join(__dirname, 'html-test.js'));
    mocha.addFile(path.join(__dirname, 'css-js-test.js'));

    mocha.run();
  });
});
