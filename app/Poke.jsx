require('./poke.less');

import React  from 'react'
import superagent from 'superagent'
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
      assets: 4,
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
    storage.get('pokemons').then(value => {
      if (value) {
        this.loadPokemons(value);
      }
    });
  }
  pokemonSelected(pokemon) {
    if (this.state.synced <= this.state.assets) return;
    this.loadPokemon(pokemon.id);
  }
  scrapeData() {
    superagent.get(URL.POKEMON_DETAILS).then((res) => {
      const pokemons = {};
      res.body.forEach(pokemon => {
        pokemons[pokemon._id] = pokemon;
      });
      storage.set(pokemons).then(() => this.setState({synced: this.state.synced + 1}))
    });

    superagent.get(URL.POKEMON_ABILITIES).then((res) => {
      const abilities = {};
      res.body.forEach(ability => {
        abilities[ability._id] = ability;
      });
      storage.set(abilities).then(() => this.setState({synced: this.state.synced + 1}))
    });

    superagent.get(URL.POKEMON_MOVES).then((res) => {
      const moves = {};
      res.body.forEach(move => {
        moves[move._id] = move;
      });
      storage.set(moves).then(() => this.setState({synced: this.state.synced + 1}))
    });

    superagent.get(URL.POKEMON_DESCRIPTION).then((res) => {
      const descriptions = {};
      res.body.forEach(description => {
        descriptions[description._id] = description;
      });
      storage.set(descriptions).then(() => this.setState({synced: this.state.synced + 1}))
    });

    const makeTheCall = () => {
      if (this.state.synced < this.state.assets) {
        return setTimeout(makeTheCall, 1000);
      }
      this.setState({synced: 5});
    }
    makeTheCall();
  }
  componentDidMount() {
    storage.clear();
    storage.get('pokemons').then(value => {
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
        storage.set('pokemons', pokemons);
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

    storage.get(pokeKey).then(value => {
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
        storage.set(pokeKey, res.body).then(value => {
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
        { (synced <= this.state.assets) && <div className="notification">{synced}&nbsp;out of assets&nbsp;{this.state.assets}&nbsp;cached</div>}
        <PokeDetails pokemon={pokeDetail} open={detailOpen} onClose={this.closeDetails}/>
      </div>
    )
  }
}
