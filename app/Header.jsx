var style = require("./header.less");

import React  from 'react'

export default class Header extends React.Component {
  render() {
    return (
      <header className="header">
        {/*<div className="animation-box">
          <img src="images/icon-192x192.png" className="animation-image" />
        </div>*/}
        <span>Pokemons</span>
      </header>
    )
  }
}
