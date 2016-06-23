var style = require("./app.less")
console.log(style);

import React  from 'react';

export default class App extends React.Component {
  render() {
    return (
      <div className={style['page-name']}>
        <div>Webpack is doing its thing with React and ES2015 oh?
          <h1 className="bold">You</h1>
        </div>
      </div>
    );
  }
}


export default class Dummy extends React.Component {
  render() {
    return (
      <div className={style.dummy}>
        <App />
      </div>
    );
  }
}
