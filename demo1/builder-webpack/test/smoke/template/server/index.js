
// 直接运行该 server 会报错 ReferenceError: window is not defined，需要做点处理
if (typeof window === 'undefined') {
  global.window = {};
}


const fs = require('fs');
const path = require('path');
const express = require('express');
const { renderToString } = require('react-dom/server');
const SSR = require('../dist/search-server'); // 使用打包出来的react组件对象
const template = fs.readFileSync(path.join(__dirname, '../dist/search.html'), 'utf-8'); // 使用打包出来的html模板
const data = require('./data.json');

const server = port => {
  const app = express();

  app.use(express.static('dist'));
  app.get('/search', (req, res) => {

    console.log(renderToString(SSR));

    const html = renderMarkup(renderToString(SSR));
    res.status(200).send(html);
  });

  app.listen(port, () => {
    console.log(`Server listening on port ${port}!`);
  });
};

server(process.env.PORT || 8000);

const renderMarkup = html => {
  const dataStr = JSON.stringify(data);
  return template.replace('<!--HTML_PLACEHOLDER_FOR_SSR-->', html)
    .replace(
      '<!-- INITIAL_DATA_PLACEHOLDER_FOR_SRR -->',
      `<script>window.__initial_data=${dataStr}</script>`
    );
}
