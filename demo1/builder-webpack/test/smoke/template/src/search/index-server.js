/**
 * 服务端打包入口组件
 * 需要使用 cjs 而不是 es6
 */

'use strict';

const React = require('react');
const logo = require('./images/logo.jpg');
require('./index.less');

class Search extends React.Component {

  constructor() {
    super(...arguments);

    this.state = {
      Text: null
    }
  }

  loadComponent() {
    import(/* webpackChunkName: "text" */'./text.js').then(Text => {
      this.setState({
        Text: Text.default
      });
    });
  }

  render() {
    const { Text } = this.state;

    return (
      <div className="search-text">
        {
          Text ? <Text /> : null
        }
        点击图片可以懒加载 Text 组件<img src={logo} onClick={this.loadComponent.bind(this)} />
      </div>
    );
  }
}

module.exports = <Search />;
