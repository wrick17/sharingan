import React  from 'react'

export default class Pokemon extends React.Component {
  render() {
    const pokemon = this.props.pokemon;
    return (
      <li className="pokemon">
        <div className="poke-img" style={{backgroundImage: 'url("'+pokemon.image+'")'}}></div>
        <label className="poke-name">{pokemon.name}</label>
      </li>
    )
  }
}
