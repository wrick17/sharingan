require('./pokemon.less')

import React  from 'react'
import classNames from 'classnames'

export default class Pokemon extends React.Component {
  render() {
    const {pokemon, onClick} = this.props;

    return (
      <li className="pokemon" onClick={this.showDetais} onClick={e => onClick(pokemon.id)}>
        <div className="poke-img" style={{backgroundImage: 'url("'+pokemon.image+'")'}}></div>
        <label className="poke-name">{pokemon.name}</label>
      </li>
    )
  }
}
