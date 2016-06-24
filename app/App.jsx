var style = require("./app.less");

import React  from 'react'
import Header from './Header.jsx'
import Poke from './Poke.jsx'

export default class App extends React.Component {
  render() {
    return (
      <div className="poke">
        <Header />
        <Poke />
      </div>
    );
  }
}
