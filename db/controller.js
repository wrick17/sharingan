var mongoose = require('mongoose');
var apiCalls = require('./apiCalls.js');
const {PokemonList, Pokemon, Description, AbilityList, Ability, MoveList, Move, Image} = require('./model.js');

var controllerMethods = {};

// pokemons

controllerMethods.fetchPokemonList = (callback = () => {}) => {

  PokemonList.find({_id: 'pokemons'}, function(err, pokemonList) {
    if (pokemonList[0] && pokemonList[0].count && pokemonList[0].expiry > Date.now()) {
      return callback(pokemonList[0].pokemons);
    }
    return apiCalls.fetchPokemonList( function (pokemonsList) {
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

// details

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
  Pokemon.find(function(err, pokemons) {
    callback(pokemons)
  });
}

// description

controllerMethods.fetchPokemonDescription = (descriptionList, callback = () => {}) => {

  Description.find((err, descriptions) => {
    if (descriptions.length === descriptionList.length) {
      console.log('descriptions gone back');
      return callback(descriptions);
    }

    var descriptionListIds = descriptionList.map(description => description.id);
    var descriptionIds = descriptions.map(description => description.id);

    var sortedList = descriptionListIds.filter(description => descriptionIds.indexOf(Number(description)) === -1);

    var count = 1;
    sortedList.forEach(descriptionId => {

      function makeTheCall() {
        if (count > 5) {
          return setTimeout(makeTheCall, 1000);
        }
        count++;
        apiCalls.fetchPokemonDescription( descriptionId, function (descriptionDetail) {
          var description = new Description(descriptionDetail);
          description.save(function(err, description) {
            count--;
            callback();
          })
        })
      }
      makeTheCall();
    })

  })
}

controllerMethods.getPokemonDescriptions = (callback = ()=>{}) => {
  Description.find(function(err, descriptions) {
    callback(descriptions)
  });
}

// images

controllerMethods.fetchPokemonImage = (pokemonList, callback = () => {}) => {

  Image.find((err, images) => {
    if (images.length === pokemonList.length) {
      if (pokemonList.length > 0 && pokemonList[0].image.includes('data:image')) {
        console.log('images gone back earlier');
        return callback(pokemonList);
      }
      console.log('images gone back');
      return controllerMethods.setPokemonImages(pokemonList, images, function(latestPokemons) {
        console.log('new images set');
        callback(latestPokemons);
      })
    }

    var pokemonListIds = pokemonList.map(pokemon => pokemon.id);
    var imageIds = images.map(image => image._id);

    var sortedList = pokemonListIds.filter(pokemonId => imageIds.indexOf(Number(pokemonId)) === -1);

    var count = 1;
    var overallCount = 0;
    sortedList.forEach(imageId => {

      function makeTheCall() {
        if (count > 5) {
          return setTimeout(makeTheCall, 1000);
        }
        count++;
        apiCalls.fetchPokemonImage( imageId, function (imageDetail) {
          var image = new Image(imageDetail);
          image.save(function(err, image) {
            count--;
            overallCount++;
            console.log('le ye mila ---> ', imageId);
            if (overallCount === pokemonList.length) {
              controllerMethods.getPokemonImages(function(images) {
                controllerMethods.setPokemonImages(pokemonList, images, function(latestPokemons) {
                  console.log('le ho gaya');
                  callback(latestPokemons);
                })
              })
            }
          })
        })
      }
      makeTheCall();
    })

  })
}

controllerMethods.getPokemonImages = (callback = ()=>{}) => {
  Image.find(function(err, images) {
    callback(images)
  });
}

controllerMethods.setPokemonImages = (pokemonList, images, callback = ()=>{}) => {
  // if (!images || images.length < 1) return;
  const imageList = {};
  images.forEach(image => {
    imageList[image._id] = image.image;
  });

  var newPokemonList = pokemonList.map(pokemon => Object.assign({}, pokemon, {
    image: imageList[pokemon.id]
  }));

  var pokemons = new PokemonList({
    _id: 'pokemons',
    count: newPokemonList.length,
    pokemons: newPokemonList,
    expiry: (Date.now() + (30 * 24 * 3600 * 1000))
  })

  pokemons.save(function(err, pokemonsList) {
    if (err) {
      return PokemonList.findOneAndUpdate({_id: 'pokemons'}, {pokemons: newPokemonList, count: newPokemonList.length}, {}, function(err, pokemonsAll) {
        console.log('new update');
        callback(pokemonsAll.pokemons)
      })
    }
    console.log('old update');
    callback(pokemonsList.pokemons)
  })
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
