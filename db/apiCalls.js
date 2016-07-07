var superagent = require('superagent');

var apiCalls = {};

apiCalls.fetchPokemonList = function(callback) {
  return superagent.get('https://pokeapi.co/api/v2/pokemon/?limit=10000').end(function(err, res) {

    var pokemonsList = res.body.results.map(function(pokemon) {

      var url = pokemon.url;
      var match = /https:\/\/pokeapi.co\/api\/v2\/pokemon\/([0-9]{0,})+\//gi.exec(url);
      var id = match[1];

      return {
        id: id,
        name: pokemon.name,
        image: 'https://pokeapi.co/media/sprites/pokemon/' + id + '.png'
      }
    })

    callback(pokemonsList);
  })
}

// pokemon details

apiCalls.fetchPokemonDetails = function(pokeId, callback) {
  function makeApiCall() {
    superagent.get('https://pokeapi.co/api/v2/pokemon/' + pokeId).end((err, res) => {
      if (err) {
        console.log('oops!', err);
        makeApiCall();
      }
      var pokemon = res.body;

      var moves = pokemon.moves.map(move => {
        var url = move.move.url;
        var match = /https:\/\/pokeapi.co\/api\/v2\/move\/([0-9]{0,})+\//gi.exec(url);
        var id = match[1];
        return {
          move: {
            id: 'move_' + id,
            name: move.move.name
          }
        }
      })

      var abilities = pokemon.abilities.map(ability => {
        var url = ability.ability.url;
        var match = /https:\/\/pokeapi.co\/api\/v2\/ability\/([0-9]{0,})+\//gi.exec(url);
        var id = match[1];
        return {
          ability: {
            id: 'ability_' + id,
            name: ability.ability.name
          }
        }
      })

      var stats = pokemon.stats.map(stat => {
        var url = stat.stat.url;
        var match = /https:\/\/pokeapi.co\/api\/v2\/stat\/([0-9]{0,})+\//gi.exec(url);
        var id = match[1];
        return {
          stat: {
            id: 'stat_' + id,
            name: stat.stat.name
          },
          base_stat: stat.base_stat
        }
      })

      var types = pokemon.types.map(type => {
        var url = type.type.url;
        var match = /https:\/\/pokeapi.co\/api\/v2\/type\/([0-9]{0,})+\//gi.exec(url);
        var id = match[1];
        return {
          type: {
            id: 'type_' + id,
            name: type.type.name
          },
          slot: type.slot
        }
      })

      callback({
        _id: 'poke_' + pokemon.id,
        id: pokemon.id,
        name: pokemon.name,
        height: pokemon.height,
        weight: pokemon.weight,
        base_experience: pokemon.base_experience,
        types: types,
        abilities: abilities,
        moves: moves,
        stats: stats
      });
    })
  }

  makeApiCall();
}

// abilities

apiCalls.fetchAbilityList = function(callback) {
  return superagent.get('https://pokeapi.co/api/v2/ability/?limit=10000').end(function(err, res) {

    var abilityList = res.body.results.map(function(ability) {

      var url = ability.url;
      var match = /https:\/\/pokeapi.co\/api\/v2\/ability\/([0-9]{0,})+\//gi.exec(url);
      var id = match[1];

      return {
        id: id,
        name: ability.name
      }
    })

    callback(abilityList);
  })
}

apiCalls.fetchAbilityDetails = function(abilityId, callback) {
  function makeApiCall() {
    superagent.get('https://pokeapi.co/api/v2/ability/' + abilityId).end((err, res) => {
      if (err) {
        console.log('oops!', err);
        makeApiCall();
      }
      var ability = res.body;

      callback({
        _id: 'ability_' + ability.id,
        id: ability.id,
        name: ability.name,
        effect: ability.effect_entries[0] ? ability.effect_entries[0].effect : 'No Description'
      });
    })
  }

  makeApiCall();
}

// moves

apiCalls.fetchMoveList = function(callback) {
  return superagent.get('https://pokeapi.co/api/v2/move/?limit=10000').end(function(err, res) {

    var moveList = res.body.results.map(function(move) {

      var url = move.url;
      var match = /https:\/\/pokeapi.co\/api\/v2\/move\/([0-9]{0,})+\//gi.exec(url);
      var id = match[1];

      return {
        id: id,
        name: move.name
      }
    })

    callback(moveList);
  })
}

apiCalls.fetchMoveDetails = function(moveId, callback) {
  function makeApiCall() {
    superagent.get('https://pokeapi.co/api/v2/move/' + moveId).end((err, res) => {
      if (err) {
        console.log('oops!', err);
        makeApiCall();
      }
      var move = res.body;

      callback({
        _id: 'move_' + move.id,
        id: move.id,
        name: move.name,
        effect: move.effect_entries[0] ? move.effect_entries[0].effect : 'No Description',
        accuracy: move.accuracy,
        type: move.type.name,
        power: move.power
      });
    })
  }

  makeApiCall();
}


module.exports = apiCalls;
