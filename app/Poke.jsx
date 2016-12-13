require('./poke.less');

import React  from 'react'
import superagent from 'superagent'
import Pokemon  from './Pokemon.jsx'
import PokeDetails  from './PokeDetails.jsx'
import Loader  from './components/Loader.jsx'
import {URL, COLORS} from './config.jsx'
import MD5 from './md5.jsx'

export default class Poke extends React.Component {
  constructor(props) {
    super(props);
    this.loadPokemons = this.loadPokemons.bind(this);
    this.loadMore = this.loadMore.bind(this);
    this.pokemonSelected = this.pokemonSelected.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.loadPokemon = this.loadPokemon.bind(this);
    this.closeDetails = this.closeDetails.bind(this);
    this.state = {
      pokemons: [],
      loading: true,
      total: 0,
      synced: 0,
      assets: 4,
      last: 0,
      currentPokemon: 0,
      pokeDetail: undefined,
      pokeDescription: undefined,
      pokeMoves: undefined,
      pokeAbilities: undefined,
      detailOpen: false
    };
    this.pokemonsCache = {
      pokemons: []
    }
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
      last: (last + pageSize),
      total: pokemonsList.length
    });
  }
  componentWillReceiveProps(newProps) {
    if (newProps.searchKey !== this.props.searchKey) {
      const filteredPokemons = this.pokemonsCache.pokemons.filter(pokemon => pokemon.name.indexOf(newProps.searchKey) !== -1);
      this.setState({
        last: 0,
        pokemons: []
      }, () => {
        this.loadPokemons(filteredPokemons)
      })
    }
  }
  loadMore() {
    storage.get('pokemons').then(value => {
      if (value) {
        this.loadPokemons(value);
      }
    });
  }
  pokemonSelected(pokemon) {
    storage.get(['pokemonsMD5', 'abilitiesMD5', 'movesMD5', 'descriptionsMD5']).then(value => {
      if (value.indexOf(null) !== -1) return;
      this.loadPokemon(pokemon.id);
    })
  }
  fetchData() {
    superagent.get(URL.POKEMON_DETAILS).then((res) => {
      storage.get('pokemonsMD5').then((data) => {
        if (data && data === MD5(res.body.toString())) {
          this.setState({synced: this.state.synced + 1})
        }
        else {
          const pokemons = {};
          res.body.forEach(pokemon => {
            pokemons[pokemon._id] = pokemon;
          });
          storage.set(pokemons).then(() => this.setState({synced: this.state.synced + 1}))
          storage.set('pokemonsMD5', MD5(res.body.toString()));
        }
      })
    });

    superagent.get(URL.POKEMON_ABILITIES).then((res) => {
      storage.get('abilitiesMD5').then((data) => {
        if (data && data === MD5(res.body.toString())) {
          this.setState({synced: this.state.synced + 1})
        }
        else {
          const abilities = {};
          res.body.forEach(ability => {
            abilities[ability._id] = ability;
          });
          storage.set(abilities).then(() => this.setState({synced: this.state.synced + 1}))
          storage.set('abilitiesMD5', MD5(res.body.toString()));
        }
      })
    });

    superagent.get(URL.POKEMON_MOVES).then((res) => {
      storage.get('movesMD5').then((data) => {
        if (data && data === MD5(res.body.toString())) {
          this.setState({synced: this.state.synced + 1})
        }
        else {
          const moves = {};
          res.body.forEach(move => {
            moves[move._id] = move;
          });
          storage.set(moves).then(() => this.setState({synced: this.state.synced + 1}))
          storage.set('movesMD5', MD5(res.body.toString()));
        }
      })
    });

    superagent.get(URL.POKEMON_DESCRIPTION).then((res) => {
      storage.get('descriptionsMD5').then((data) => {
        if (data && data === MD5(res.body.toString())) {
          this.setState({synced: this.state.synced + 1})
        }
        else {
          const descriptions = {};
          res.body.forEach(description => {
            descriptions[description._id] = description;
          });
          storage.set(descriptions).then(() => this.setState({synced: this.state.synced + 1}))
          storage.set('descriptionsMD5', MD5(res.body.toString()));
        }
      })
    });

    superagent.get(URL.POKEMONS).then((res) => {
      storage.get('listMD5').then((data) => {
        if (data && data === MD5(res.body.pokemons.toString())) {
          this.setState({synced: this.state.synced + 1})
        }
        else {
          const pokemons = res.body.pokemons;
          this.setState({
            total: pokemons.length,
            synced: this.state.synced + 1
          });
          this.pokemonsCache.pokemons = pokemons;
          storage.set('pokemons', pokemons);
          storage.set('listMD5', res.body.pokemons.toString());
          this.loadPokemons(pokemons);
        }
      })
    });

    const makeTheCall = () => {
      if (this.state.synced < this.state.assets) {
        return setTimeout(makeTheCall, 1000);
      }
      this.setState({synced: this.state.synced + 1});
    }
    makeTheCall();
  }
  componentDidMount() {
    storage.get('pokemons').then(value => {
      let updateFlag = false;
      if (value) {
        this.pokemonsCache.pokemons = value;
        this.setState({
          total: value.length
        });
        this.loadPokemons(value);
        updateFlag = true;
      }
    });

    this.fetchData();

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
    const descriptionKey = 'desc_' + id;

    const pokeDetail = storage.get(pokeKey);
    const pokeDescription = storage.get(descriptionKey);

    Promise.all([pokeDetail, pokeDescription]).then(value => {
      if (value) {
        const moves = value[0].moves;
        const moveKeys = moves.map(move => move.move.id);
        const abilities = value[0].abilities;
        const abilityKeys = abilities.map(ability => ability.ability.id);

        this.setState({
          pokeDetail: value[0],
          pokeDescription: value[1],
          pokeMoves: moveKeys,
          pokeAbilities: abilityKeys,
          currentPokemon: id
        }, () => {
          this.setState({
            detailOpen: true
          }, () => {
            this.changeTitleColor(COLORS[value[0].types.filter(typeObj => typeObj.slot === 1)[0].type.name]);
          });
        })

      }
    });
  }
  closeDetails() {
    this.setState({ detailOpen: false }, () => {
      this.changeTitleColor('#f44336',  true);
    });
  }
  render() {
    const {pokemons, currentPokemon, pokeDetail, pokeDescription, pokeMoves, pokeAbilities, detailOpen, last, synced, total} = this.state;
    let currentPokemonImage;
    const currentPokemonArray = pokemons.filter(pokemon => pokemon.id === currentPokemon);
    if (currentPokemonArray.length > 0) currentPokemonImage = currentPokemonArray[0].image;
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
        <PokeDetails pokemon={pokeDetail} image={currentPokemonImage} currentPokemon={currentPokemon} description={pokeDescription} open={detailOpen} moves={pokeMoves} abilities={pokeAbilities} onClose={this.closeDetails}/>
      </div>
    )
  }
}
