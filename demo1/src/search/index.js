'use strict';

import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { common } from '../../common';
import { a } from './tree-shaking';
import logo from './images/logo.jpg';
import './index.less';

common();

const text = a();
console.log(text);

// function Search() {

//   const [Text, setText] = useState(null);
//   const [count, setCount] = useState(0);

//   const loadComponent = () => {
//     import(/* webpackChunkName: "text" */'./text.js').then(Text => {
//       // debugger
//       setText(Text.default);
//       console.log(Text.default)
//       setCount(1000);
//     });
//   }

//   return (
//     <div className="search-text">
//       {count}
//       {
//         Text ? <Text /> : null
//       }
//       点击图片可以懒加载 Text 组件<img src={logo} onClick={loadComponent} />
//     </div>
//   );
// }


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

ReactDOM.render(
  <Search />,
  document.getElementById('root')
);
