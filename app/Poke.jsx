require('./poke.less');

import React from 'react'

class Pokemon extends React.Component {
  render() {
    return (
      <li className="pokemon">
        <img className="poke-img" src="http://pokeapi.co/media/sprites/pokemon/shiny/12.png" />
        <label className="poke-name">butterfree</label>
      </li>
    )
  }
}

export default class Poke extends React.Component {
  render() {
    const pokemons = [];
    for (var i = 0; i < 100; i++) {
      pokemons.push(<Pokemon />)
    }
    return (
      <ul className="poke-list">
        { pokemons }
      </ul>
    )
  }
}
