/**
 * 测试构建完成后的 build 目录是否有内容输出
 */

const glob = require('glob-all');

describe('Checking generated css js files', () => {
  it('should generate css js files', (done) => {
    const files = glob.sync([
      './dist/index_*.js',
      './dist/index_*.css',
      './dist/search_*.js',
      './dist/search_*.css'
    ]);

    if (files.length > 0) {
      done();
    } else {
      throw new Error('no css js files generated');
    }
  });
});
