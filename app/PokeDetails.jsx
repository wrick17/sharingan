require('./pokeDetails.less')

import React from 'react'
import classNames from 'classnames'
import localforage from 'localforage'
import superagent from 'superagent'
import {COLORS} from './config.jsx'

export default class PokeDetails extends React.Component {
  render() {
    const {pokemon, onClose, open} = this.props;
    if (!pokemon) return null;

    const type = pokemon.types.filter(type => type.slot === 1)[0].type.name;
    return (
      <div className={classNames("pokemon-details-wrapper", {'show': open})}>
        <div className="overlay"></div>
        <div className={classNames("pokemon-details", {'show': open})}>
          <h3 className="details-header" style={{backgroundColor: COLORS[type]}}>
            <label className="pokemon-name">{pokemon.name}</label>
            <button onClick={onClose} className="close-button">close <span className="cross">✕</span></button>
          </h3>
          <div className="pokemon-important-info">
            <div className="poke-img" style={{backgroundImage: 'url("'+'https://pokeapi.co/media/sprites/pokemon/' + pokemon.id + '.png'+'")'}} ></div>
            <div className="stats">
              <ul className="types">
                {
                  pokemon.types.map(type => <li className="type" key={type.slot} style={{backgroundColor: COLORS[type.type.name]}}>{type.type.name}</li>)
                }
              </ul>
              <label className="poke-id">#{pokemon.id}</label>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
