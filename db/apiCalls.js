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

module.exports = apiCalls;
