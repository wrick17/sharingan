require('./pokeDetails.less')

import React from 'react'
import classNames from 'classnames'
import superagent from 'superagent'
import {COLORS} from './config.jsx'
import Statistic from './components/Statistic.jsx'
import Loader  from './components/Loader.jsx'

let keyCounter = 1;

class Ability extends React.Component {
  constructor(props) {
    super(props);
    this.showAbility = this.showAbility.bind(this);
    this.state = {
      ability: {},
      expanded: false
    }
  }
  // componentWillReceiveProps(newProps) {
  //   const ability = newProps.ability;
  //   storage.get(ability).then((data) => {
  //     this.setState({
  //       ability: data
  //     });
  //   })
  // }
  componentDidMount() {
    const ability = this.props.ability;
    storage.get(ability).then((data) => {
      this.setState({
        ability: data
      });
    })
  }
  showAbility() {
    this.setState({
      expanded: !this.state.expanded
    });
  }
  render() {
    const {expanded, ability} = this.state;
    if (!ability) return null;
    return (
      <li className={classNames("move", {'expanded': expanded})}>
        <div className="move-header" onClick={this.showAbility}>
          <label className="move-title">{ability.name}</label>
          <span className={classNames("move-icon", {'expanded': expanded})}>▷</span>
        </div>
        { expanded && <div className="move-description">{ability.effect}</div>}
      </li>
    )
  }
}

class Move extends React.Component {
  constructor(props) {
    super(props);
    this.showMove = this.showMove.bind(this);
    this.state = {
      move: {},
      expanded: false
    }
  }
  // componentWillReceiveProps(newProps) {
  //   const move = newProps.move;
  //   storage.get(move).then((data) => {
  //     this.setState({
  //       move: data
  //     });
  //   })
  // }
  componentDidMount() {
    const move = this.props.move;
    storage.get(move).then((data) => {
      this.setState({
        move: data
      });
    })
  }
  showMove() {
    this.setState({ expanded: !this.state.expanded });
  }
  render() {
    const {expanded, move} = this.state;
    if (!move) return null;
    return (
      <li className={classNames("move", {'expanded': expanded})}>
        <div className="move-header" onClick={this.showMove}>
          <label className="move-title">{move.name}</label>
          <span className="move-type" style={{backgroundColor: COLORS[move.type]}}>{move.type}</span>
          <span className={classNames("move-icon", {'expanded': expanded})}>▷</span>
        </div>
        { expanded && <div className="move-description">
          <div className="minor-details">
            <div className="detail">
              <label>Power:</label><span>{move.power}</span>
            </div>
            <div className="detail">
              <label>Accuracy:</label><span>{move.accuracy}%</span>
            </div>
          </div>
          <div>{move.effect}</div>
        </div>}
      </li>
    )
  }
}

export default class PokeDetails extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      moves: [],
      abilities: []
    };
  }

  componentWillReceiveProps(newProps) {
    const {moves, abilities, open} = newProps;
    if (this.props.currentPokemon !== newProps.currentPokemon) {
      setTimeout(() => {
        this.setState({
          moves,
          abilities
        })
      }, 500);
    }
  }

  makeid()
  {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 10; i++ )
    text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
  }

  render() {
    const {pokemon, description, onClose, open, image} = this.props;
    const {moves, abilities} = this.state;
    // console.log(this.state);
    let showAll = true;
    // console.log(!pokemon, !description, !moves, moves.length < 1, !abilities, abilities.length < 1);
    if (!pokemon || !description) showAll = false;
    let type;
    if(showAll) type = pokemon.types.filter(type => type.slot === 1)[0].type.name;
    return (
      <div className={classNames("pokemon-details-wrapper", {'show': (open)})}>
        <div className="overlay"></div>
        <div className={classNames("pokemon-details", {'show': open})}>
          {
            showAll &&
            <div className="details-shell">

              <h3 className="details-header" style={{backgroundColor: COLORS[type]}}>
                <div className="wrapper">
                  <label className="pokemon-name">{pokemon.name}</label>
                  <button onClick={onClose} className="close-button"><span className="cross">✕</span></button>
                </div>
              </h3>

              <div className="pokemon-details-shell">
                <div className="pokemon-details-container">
                  <div className="pokemon-important-info">
                    <div className="poke-img" style={{backgroundImage: 'url(' + image + ')'}} ></div>

                    <div className="stats">
                      <ul className="types">
                        {
                          pokemon.types.map(typeObj => <li className="type" key={typeObj.slot} style={{backgroundColor: COLORS[typeObj.type.name]}}>{typeObj.type.name}</li>)
                        }
                      </ul>
                      <label className="poke-id">#{pokemon.id}</label>
                      <ul className="stats-group">
                        {
                          pokemon.stats.map((statObj, key) => <Statistic value={statObj.base_stat} color={COLORS[type]} title={statObj.stat.name} key={key}/>)
                        }
                      </ul>
                    </div>
                  </div>

                  <div className="attributes">
                    <h3 className="sub-header" style={{backgroundColor: COLORS[type]}}>about</h3>
                    <p className="pokemon-description">{description.description}</p>
                    <dl className="detial-group">
                      <dt>Height</dt>
                      <dd>{pokemon.height/10} m</dd>
                    </dl>
                    <dl className="detial-group">
                      <dt>Weight</dt>
                      <dd>{pokemon.weight/10} kg</dd>
                    </dl>
                    <dl className="detial-group">
                      <dt>experience</dt>
                      <dd>{pokemon.base_experience} XP</dd>
                    </dl>
                    <dl className="detial-group">
                      <dt>capture rate</dt>
                      <dd>{description.captureRate}</dd>
                    </dl>
                    <dl className="detial-group">
                      <dt>happiness</dt>
                      <dd>{description.happiness}</dd>
                    </dl>
                    <dl className="detial-group">
                      <dt>growth rate</dt>
                      <dd>{description.growthRate}</dd>
                    </dl>
                    <dl className="detial-group">
                      <dt>habitat</dt>
                      <dd>{description.habitat}</dd>
                    </dl>
                  </div>

                  <div className="moves-container">
                    <h3 className="sub-header" style={{backgroundColor: COLORS[type]}}>abilities</h3>
                    <ul className="moves">
                      {
                        abilities && abilities.length > 0 ?
                        abilities.slice(0, 10).map((ability, key) => <Ability key={this.makeid()} ability={ability} />) :
                        <Loader/>
                      }
                    </ul>
                  </div>

                  <div className="moves-container">
                    <h3 className="sub-header" style={{backgroundColor: COLORS[type]}}>Moves</h3>
                    <ul className="moves">
                      {
                        moves && moves.length > 0 ?
                        moves.slice(0, 10).map((move, key) => <Move key={this.makeid()} move={move} />) :
                        <Loader/>
                      }
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          }
        </div>
      </div>
    )
  }
}
