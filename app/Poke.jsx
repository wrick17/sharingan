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

    requestAnimationFrame(() => {
      this.scrapeData(pokemonsList);
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
  scrapeData(pokemons) {
    const totalPokemons = pokemons.length;
    localforage.keys().then(value => {
      const pokemonsInCache = value;
      const pokemonIds = pokemons.map(pokemon => 'poke_'+pokemon.id).filter(pokemon => pokemonsInCache.indexOf(pokemon) === -1);
      let count = this.state.total - pokemonIds.length;
      pokemonIds.map(pokemon => {
        const pokeKey = pokemon;

        localforage.getItem(pokeKey).then(value => {
          if (value) {
            count++;
            this.setState({ synced: count });
            return;
          }

          const pokeId = pokemon.replace('poke_', '');
          superagent.get(URL.POKEMON + pokeId).then(res => {
            localforage.setItem(pokeKey, res.body).then(value => {
              count++;
              this.setState({
                synced: count
              });
            });
          })
        })
      })
    });
  }
  componentDidMount() {
    // return localforage.clear();
    localforage.getItem('pokemon').then(value => {
      let updateFlag = false;
      if (value) {
        this.setState({
          total: value.length
        });
        this.loadPokemons(value);
        updateFlag = true;
        // return;
      }

      superagent.get(URL.ALL_POKEMONS).then((res) => {
        this.setState({
          total: res.body.results.length
        });
        var worker = new Worker("worker.js");
        worker.postMessage(res.body.results);
        worker.onmessage = (e) => {
          this.loadPokemons(e.data, updateFlag);
          localforage.setItem('pokemon', e.data);
        }
      })
    });

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
