var assert = require('assert');

describe('webpack.base.js test case', () => {

  const baseConfig = require('../../lib/webpack.base.js');

  console.log(baseConfig);

  it('entry', () => {
    assert.equal(baseConfig.entry.index, 'C:/Users/Administrator/Projects/webpack/my-project/demo1/builder-webpack/test/smoke/template/src/index/index.js');
    assert.equal(baseConfig.entry.search, 'C:/Users/Administrator/Projects/webpack/my-project/demo1/builder-webpack/test/smoke/template/src/search/index.js');
  });
});
