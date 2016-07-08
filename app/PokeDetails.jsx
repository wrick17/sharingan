require('./pokeDetails.less')

import React from 'react'
import classNames from 'classnames'
import superagent from 'superagent'
import {COLORS} from './config.jsx'
import Statistic from './components/Statistic.jsx'

class Ability extends React.Component {
  constructor(props) {
    super(props);
    this.showAbility = this.showAbility.bind(this);
    this.state = {
      expanded: false,
      ability: undefined
    }
  }
  componentDidMount() {
    storage.get(this.props.abilityObj.ability.id).then(data => {
      this.setState({ ability: data });
    })
  }
  showAbility() {
    this.setState({ expanded: !this.state.expanded });
  }
  render() {
    const {abilityObj} = this.props;
    const {expanded, ability} = this.state;
    if (!ability) return null;
    return (
      <li className={classNames("move", {'expanded': expanded})}>
        <div className="move-header" onClick={this.showAbility}>
          <label className="move-title">{abilityObj.ability.name}</label>
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
      expanded: false,
      move: undefined
    }
  }
  componentDidMount() {
    storage.get(this.props.moveObj.move.id).then(data => {
      this.setState({ move: data });
    })
  }
  showMove() {
    this.setState({ expanded: !this.state.expanded });
  }
  render() {
    const {moveObj} = this.props;
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
      description: undefined
    }
  }
  componentWillReceiveProps(newProps) {
    if (!newProps.pokemon) return;
    storage.get('desc_' + newProps.pokemon.id).then(data => {
      this.setState({
        description: data
      })
    })
  }
  render() {
    const {pokemon, onClose, open} = this.props;
    let {description} = this.state;
    if (!pokemon) return null;
    if (!description) description = {};

    const type = pokemon.types.filter(type => type.slot === 1)[0].type.name;
    return (
      <div className={classNames("pokemon-details-wrapper", {'show': (open && this.state.description)})}>
        <div className="overlay"></div>

        <div className={classNames("pokemon-details", {'show': open})}>

          <h3 className="details-header" style={{backgroundColor: COLORS[type]}}>
            <div className="wrapper">
              <label className="pokemon-name">{pokemon.name}</label>
              <button onClick={onClose} className="close-button"><span className="cross">✕</span></button>
            </div>
          </h3>

          <div className="pokemon-details-container">

            <div className="pokemon-important-info">
              <div className="poke-img" style={{backgroundImage: 'url("'+'https://pokeapi.co/media/sprites/pokemon/' + pokemon.id + '.png'+'")'}} ></div>

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
              <h3 className="sub-header" style={{backgroundColor: COLORS[type]}}>physical attributes</h3>
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
                  pokemon.abilities.map((abilityObj, key) => <Ability key={key+pokemon.id} abilityObj={abilityObj} />)
                }
              </ul>
            </div>

            <div className="moves-container">
              <h3 className="sub-header" style={{backgroundColor: COLORS[type]}}>Moves</h3>
              <ul className="moves">
                {
                  pokemon.moves.map((moveObj, key) => <Move key={key+pokemon.id} moveObj={moveObj} />)
                }
              </ul>
            </div>

          </div>
        </div>
      </div>
    )
  }
}
