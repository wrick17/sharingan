var mongoose = require('mongoose');
var apiCalls = require('./apiCalls.js');
const {PokemonList, Pokemon, AbilityList, Ability, MoveList, Move} = require('./model.js');

var controllerMethods = {};

// pokemons

controllerMethods.fetchPokemonList = (callback = () => {}) => {

  PokemonList.find({_id: 'pokemons'}, function(err, pokemonList) {
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
        if (err) {
          return PokemonList.findOneAndUpdate({_id: 'pokemons'}, {pokemons: pokemonsList, count: pokemonsList.length}, {new: true}, function(err, pokemons) {
            callback(pokemons.pokemons)
          })
        }
        callback(pokemons.pokemons)
      })
    })
  })
}

controllerMethods.fetchPokemonDetails = (pokemonList, callback = () => {}) => {

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
  PokemonList.find(function(err, pokemonList) {
    if (pokemonList[0] && pokemonList[0].pokemons) {
      return callback(pokemonList[0]);
    }
    callback([])
  });
}

controllerMethods.getPokemonDetails = (callback = ()=>{}) => {
  Pokemons.find(function(err, pokemons) {
    callback(pokemons)
  });
}

// abilities

controllerMethods.fetchAbilityList = (callback = () => {}) => {

  AbilityList.find({_id: 'abilities'}, function(err, abilityList) {
    if (abilityList[0] && abilityList[0].count && abilityList[0].expiry > Date.now()) {
      callback(abilityList[0].abilities);
    }
    apiCalls.fetchAbilityList( function (abilityList) {
      var abilities = new AbilityList({
        _id: 'abilities',
        count: abilityList.length,
        abilities: abilityList,
        expiry: (Date.now() + (30 * 24 * 3600 * 1000))
      })

      abilities.save(function(err, abilities) {
        if (err) {
          return AbilityList.findOneAndUpdate({_id: 'abilities'}, {abilities: abilityList, count: abilityList.length}, {new: true}, function(err, abilities) {
            callback(abilities.abilities)
          })
        }
        callback(abilities.abilities)
      })
    })
  })
}

controllerMethods.fetchAbilityDetails = (abilityList, callback = () => {}) => {

  Ability.find((err, abilities) => {
    if (abilities.length === abilityList.length) {
      return callback(abilities);
    }

    var abilityListIds = abilityList.map(ability => ability.id);
    var abilityIds = abilities.map(ability => ability.id);

    var sortedList = abilityListIds.filter(ability => abilityIds.indexOf(Number(ability)) === -1);

    var count = 1;
    sortedList.forEach(abilityId => {

      function makeTheCall() {
        if (count > 5) {
          return setTimeout(makeTheCall, 1000);
        }
        count++;
        apiCalls.fetchAbilityDetails( abilityId, function (abilityDetail) {
          var ability = new Ability(abilityDetail);
          ability.save(function(err, ability) {
            count--;
            callback();
          })
        })
      }
      makeTheCall();
    })

  })
}

controllerMethods.getAbilityList = (callback = ()=>{}) => {
  AbilityList.find(function(err, abilityList) {
    if (abilityList[0] && abilityList[0].abilities) {
      return callback(abilityList[0]);
    }
    callback([])
  });
}

controllerMethods.getAbilityDetails = (callback = ()=>{}) => {
  Ability.find(function(err, abilities) {
    callback(abilities)
  });
}

// moves

controllerMethods.fetchMoveList = (callback = () => {}) => {

  MoveList.find({_id: 'moves'}, function(err, moveList) {
    if (moveList[0] && moveList[0].count && moveList[0].expiry > Date.now()) {
      callback(moveList[0].moves);
    }
    apiCalls.fetchMoveList( function (moveList) {
      var moves = new MoveList({
        _id: 'moves',
        count: moveList.length,
        moves: moveList,
        expiry: (Date.now() + (30 * 24 * 3600 * 1000))
      })

      moves.save(function(err, moves) {
        if (err) {
          return MoveList.findOneAndUpdate({_id: 'moves'}, {moves: moveList, count: moveList.length}, {new: true}, function(err, moves) {
            callback(moves.moves)
          })
        }
        callback(moves.moves)
      })
    })
  })
}

controllerMethods.fetchMoveDetails = (moveList, callback = () => {}) => {

  Move.find((err, moves) => {
    if (moves.length === moveList.length) {
      return callback(moves);
    }

    var moveListIds = moveList.map(move => move.id);
    var moveIds = moves.map(move => move.id);

    var sortedList = moveListIds.filter(move => moveIds.indexOf(Number(move)) === -1);

    var count = 1;
    sortedList.forEach(moveId => {

      function makeTheCall() {
        if (count > 5) {
          return setTimeout(makeTheCall, 1000);
        }
        count++;
        apiCalls.fetchMoveDetails( moveId, function (moveDetail) {
          var move = new Move(moveDetail);
          move.save(function(err, move) {
            count--;
            callback();
          })
        })
      }
      makeTheCall();
    })

  })
}

controllerMethods.getMoveList = (callback = ()=>{}) => {
  MoveList.find(function(err, moveList) {
    if (moveList[0] && moveList[0].moves) {
      return callback(moveList[0]);
    }
    callback([])
  });
}

controllerMethods.getMoveDetails = (callback = ()=>{}) => {
  Move.find(function(err, moves) {
    callback(moves)
  });
}


module.exports = controllerMethods;
