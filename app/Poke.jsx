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
    this.loadPokemons = this.loadPokemons.bind(this);
    this.loadMore = this.loadMore.bind(this);
    this.state = {
      pokemons: [],
      loading: true,
      total: 0,
      last: 0
    };
  }
  loadPokemons(pokemonsList) {
    const {last, pokemons} = this.state;
    const pageSize = 20;
    const newPokemons = pokemonsList.slice(last, (last + pageSize));
    const newListOfPokemons = [...pokemons, ...newPokemons];

    this.setState({
      pokemons: newListOfPokemons,
      loading: false,
      last: (last + pageSize)
    });
  }
  loadMore() {
    localforage.getItem('pokemon').then(value => {
      if (value) {
        this.loadPokemons(value);
      }
    });
  }
  componentDidMount() {
    localforage.getItem('pokemon').then(value => {
      if (value) {
        this.loadPokemons(value);
      }

      superagent.get(URL.ALL_POKEMONS).then((res) => {
        var myWorker = new Worker("worker.js");
        myWorker.postMessage(res.body.results);
        myWorker.onmessage = (e) => {
          this.loadPokemons(e.data);
          localforage.setItem('pokemon', e.data);
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
        <li className="load-more" onClick={this.loadMore}>show more</li>
      </ul>
    )
  }
}
