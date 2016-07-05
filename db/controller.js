var mongoose = require('mongoose');
var apiCalls = require('./apiCalls.js');

var controllerMethods = {};

controllerMethods.fetchPokemonList = (callback = () => {}) => {
  const PokemonList = require('./pokemons.js');

  PokemonList.find(function(err, pokemonList) {
    if (pokemonList[0] && pokemonList[0].count && pokemonList[0].expiry > Date.now()) {
      callback(pokemonList[0].pokemons);
    }
    apiCalls.fetchPokemonList( function (pokemonsList) {
      var pokemons = new PokemonList({
        _id: 'pokemons',
        count: pokemonsList.length,
        pokemons: pokemonsList,
        expiry: (Date.now() + (30 * 24 * 3600 * 1000))
      })

      pokemons.save(function(err, pokemons) {
        callback(pokemons.pokemons)
      })
    })
  })
}

controllerMethods.fetchPokemonDetails = (pokemonList, callback = () => {}) => {
  const Pokemon = require('./pokemon.js');

  Pokemon.find((err, pokemons) => {
    if (pokemons.length === pokemonList.length) {
      return callback(pokemons);
    }

    var pokemonListIds = pokemonList.map(poke => poke.id);
    var pokemonIds = pokemons.map(poke => poke.id);

    var sortedList = pokemonListIds.filter(poke => pokemonIds.indexOf(Number(poke)) === -1);

    var count = 1;
    sortedList.forEach(pokemonId => {

      function makeTheCall() {
        if (count > 5) {
          return setTimeout(makeTheCall, 1000);
        }
        count++;
        apiCalls.fetchPokemonDetails( pokemonId, function (pokemonDetail) {
          var pokemon = new Pokemon(pokemonDetail);
          pokemon.save(function(err, pokemon) {
            count--;
            callback();
          })
        })
      }
      makeTheCall();
    })

  })
}

controllerMethods.getPokemonList = (callback = ()=>{}) => {
  const PokemonList = require('./pokemons.js');

  PokemonList.find(function(err, pokemonList) {
    if (pokemonList[0] && pokemonList[0].pokemons) {
      return callback(pokemonList[0]);
    }
    callback([])
  });
}

controllerMethods.getPokemonDetails = (callback = ()=>{}) => {
  const Pokemons = require('./pokemon.js');

  Pokemons.find(function(err, pokemons) {
    callback(pokemons)
  });
}

module.exports = controllerMethods;
