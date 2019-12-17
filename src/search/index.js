'use strict';

import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { common } from '../../common';
import { a } from './tree-shaking';
import beauty from './images/beauty.jpg';
import './index.less';

// common();

const text = a();
console.log(text);


function Search() {
  const [count, setCount] = useState(0);

  return (
    <div className="search-text">
      你好，赵丽颖啊<img src={beauty} />
    </div>
  );
}

ReactDOM.render(
  <Search />,
  document.getElementById('root')
);
