/**
 * 测试构建完成后的 build 目录是否有内容输出
 */

const glob = require('glob-all');

describe('Checking generated html files', () => {
  it('should generate html files', (done) => {
    const files = glob.sync([
      './dist/index.html',
      './dist/search.html'
    ]);

    if (files.length > 0) {
      done();
    } else {
      throw new Error('no html files generated');
    }
  });
});
