require('./poke.less');

import React  from 'react'
import superagent from 'superagent'
import localforage  from 'localforage'
import Pokemon  from './Pokemon.jsx'
import Loader  from './Loader.jsx'
import URL from './config.jsx'

export default class Poke extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pokemons: [],
      loading: true
    };
  }
  componentDidMount() {
    localforage.getItem('pokemon').then((value) => {
      if (value) {
        this.setState({
          pokemons: value,
          loading: false
        });
        // return;
      }

      superagent.get(URL.ALL_POKEMONS).then((res) => {
        var myWorker = new Worker("worker.js");
        myWorker.postMessage(res.body.results);
        myWorker.onmessage = (e) => {
          this.setState({
            pokemons: e.data,
            loading: false
          });
          localforage.setItem('pokemon', e.data)
        }
      })
    });

  }
  render() {
    const pokemons = this.state.pokemons;
    if (this.state.loading) return <Loader />
    return (
      <ul className="poke-list">
        {
          pokemons.map(pokemon => <Pokemon pokemon={pokemon} key={pokemon.id} />)
        }
      </ul>
    )
  }
}
