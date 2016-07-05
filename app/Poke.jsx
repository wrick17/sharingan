require('./poke.less');

import React  from 'react'
import superagent from 'superagent'
import localforage  from 'localforage'
import Pokemon  from './Pokemon.jsx'
import PokeDetails  from './PokeDetails.jsx'
import Loader  from './components/Loader.jsx'
import {URL, COLORS} from './config.jsx'

export default class Poke extends React.Component {
  constructor(props) {
    super(props);
    this.loadPokemons = this.loadPokemons.bind(this);
    this.loadMore = this.loadMore.bind(this);
    this.pokemonSelected = this.pokemonSelected.bind(this);
    this.scrapeData = this.scrapeData.bind(this);
    this.loadPokemon = this.loadPokemon.bind(this);
    this.closeDetails = this.closeDetails.bind(this);
    this.state = {
      pokemons: [],
      loading: true,
      total: 0,
      synced: 0,
      last: 0,
      pokeDetail: undefined,
      detailOpen: false
    };
  }
  loadPokemons(pokemonsList, updateFlag) {
    if (updateFlag) return;

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
  pokemonSelected(pokemon) {
    this.loadPokemon(pokemon.id);
  }
  scrapeData() {
    superagent.get(URL.POKEMON_DETAILS).then((res) => {
      const pokemons = res.body;

      pokemons.forEach(pokemon => {
        localforage.setItem(pokemon._id, pokemon);
      })
    });
  }
  componentDidMount() {
    localforage.getItem('pokemon').then(value => {
      let updateFlag = false;
      if (value) {
        this.setState({
          total: value.length
        });
        this.loadPokemons(value);
        updateFlag = true;
      }

      superagent.get(URL.POKEMONS).then((res) => {
        const pokemons = res.body.pokemons;
        this.setState({
          total: pokemons.length
        });
        localforage.setItem('pokemon', pokemons);
        this.loadPokemons(pokemons, updateFlag);
      })
    });

    this.scrapeData();

  }
  changeTitleColor(color, instant) {
    setTimeout(() => {
      const metas = document.getElementsByTagName('meta');
      metas['theme-color'].content = color;
      metas['apple-mobile-web-app-status-bar-style'].content = color;
      metas['msapplication-TileColor'].content = color;
    }, instant ? 0 : 300);
  }
  loadPokemon(id) {
    if (!id) return;

    const pokeKey = 'poke_' + id;

    localforage.getItem(pokeKey).then(value => {
      let updateFlag = false;
      if (value) {
        this.setState({
          pokeDetail: value
        }, () => {
          requestAnimationFrame(() => {
            this.setState({
              detailOpen: true
            }, () => {
              this.changeTitleColor(COLORS[value.types.filter(typeObj => typeObj.slot === 1)[0].type.name]);
            });
          })
        });
        updateFlag = true;
      }

      if (updateFlag) return;
      superagent.get(URL.POKEMON + id).then(res => {
        localforage.setItem(pokeKey, res.body).then(value => {
          this.setState({
            pokeDetail: value
          }, () => {
            requestAnimationFrame(() => {
              this.setState({
                detailOpen: true
              }, () => {
                this.changeTitleColor(COLORS[value.types.filter(typeObj => typeObj.slot === 1)[0].type.name]);
              });
            })
          });
        });
      })
    });
  }
  closeDetails() {
    this.setState({ detailOpen: false }, () => {
      this.changeTitleColor('#f44336',  true);
    });
  }
  render() {
    const {pokemons, pokeDetail, detailOpen, last, synced, total} = this.state;
    if (this.state.loading) return <Loader />
    return (
      <div className="poke-list-container">
        <ul className="poke-list">
          {
            pokemons.map(pokemon => <Pokemon pokemon={pokemon} onClick={this.pokemonSelected} key={pokemon.id} />)
          }
          { (last < total) && <li className="load-more" onClick={this.loadMore}>show more</li>}
        </ul>
        { (synced < total) && (synced > 0) && <div className="notification">{synced}&nbsp;out of&nbsp;{total}&nbsp;pokemons synced</div>}
        <PokeDetails pokemon={pokeDetail} open={detailOpen} onClose={this.closeDetails}/>
      </div>
    )
  }
}
