'use strict';

import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import beauty from './images/beauty.jpg';
import './index.less';

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
