'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import beauty from './images/beauty.jpg';
import './search.less';

function Search() {
  return (
    <div className="search-text">
      Search Text 你好啊<img src={beauty} />
    </div>
  );
}

ReactDOM.render(
  <Search />,
  document.getElementById('root')
);
