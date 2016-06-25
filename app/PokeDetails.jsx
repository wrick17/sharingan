require('./pokeDetails.less')

import React from 'react'
import classNames from 'classnames'
import localforage from 'localforage'
import superagent from 'superagent'
import URL from './config.jsx'

export default class PokeDetails extends React.Component {
  constructor(props) {
    super(props);
    this.loadPokemon = this.loadPokemon.bind(this);
    this.state = {
      pokemon: {}
    }
  }
  loadPokemon(id) {
    if (!id) return;
    const pokeKey = 'poke_' + id;

    localforage.getItem(pokeKey).then(value => {
      if (value) {
        console.log('from DB -> ', value);
        this.setState({
          pokemon: value
        });
      }

      superagent.get(URL.POKEMON + id).then(res => {
        localforage.setItem(pokeKey, res.body).then(value => {
          console.log('from api -> ', value);
          this.setState({
            pokemon: value
          });
        });
      })
    });
  }
  componentWillReceiveProps(newProps) {
    if (newProps.pokemon.id !== this.props.pokemon.id) {
      this.loadPokemon(newProps.pokemon.id);
    }
  }
  render() {
    const {pokemon, onClose, open} = this.props;
    return (
      <div className={classNames("pokemon-details-wrapper", {'show': open})}>
        <div className="overlay"></div>
        <div className={classNames("pokemon-details", {'show': open})}>
          <button onClick={onClose} className="back-button">back</button>
          <div className="pokemon-important-info">
            <div className="poke-img" style={{backgroundImage: 'url("'+pokemon.image+'")'}} ></div>
          </div>
        </div>
      </div>
    )
  }
}
