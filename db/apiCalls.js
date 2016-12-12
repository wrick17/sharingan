var superagent = require('superagent');
var fs = require('fs');
var apiCalls = {};

apiCalls.fetchPokemonList = function(callback) {
  return superagent.get('https://pokeapi.co/api/v2/pokemon/?limit=10').end(function(err, res) {

    function base64_encode(file) {
      var bitmap = fs.readFileSync(file);
      return new Buffer(bitmap).toString('base64');
    }

    var pokemonsList = res.body.results.map(function(pokemon) {

      var url = pokemon.url;
      var match = /https:\/\/pokeapi.co\/api\/v2\/pokemon\/([0-9]{0,})+\//gi.exec(url);
      var id = match[1];

      function makeApiCall(pokeId) {
        var file = fs.createWriteStream("file.jpg");
        superagent.get('https://pokeapi.co/media/sprites/pokemon/' + pokeId + '.png').end((err, res) => {
          if (err) {
            console.log('oops!', pokeId);
            return makeApiCall(pokeId);
          }
          res.pipe(file);
          console.log(pokeId);
          file.on('finish', function() {
            file.close(function() {
              console.log(base64_encode(file));
            });
          });
        })
      }

      makeApiCall(id);

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
        return makeApiCall();
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

// description

apiCalls.fetchPokemonDescription = function(pokeId, callback) {
  let count = 1;
  function makeApiCall() {
    if (count > 1) {
      return callback({
        _id: 'desc_' + pokeId,
        id: pokeId,
        description: 'No description',
        habitat: 'N/A' ,
        growthRate: 'N/A',
        happiness: 0,
        captureRate: 0
      });
    }
    superagent.get('https://pokeapi.co/api/v2/pokemon-species/' + pokeId).end((err, res) => {
      if (err) {
        count++;
        return makeApiCall();
      }
      var pokemon = res ? res.body : {};

      callback({
        _id: 'desc_' + pokemon.id,
        id: pokemon.id,
        description: ((pokemon.flavor_text_entries || []).filter(flavour => (flavour.version.name === 'alpha-sapphire' || flavour.version.name === 'y') && flavour.language.name === 'en')[0] || {}).flavor_text || 'No Description',
        habitat: pokemon.habitat ? pokemon.habitat.name : 'N/A' ,
        growthRate: pokemon.growth_rate ? pokemon.growth_rate.name : 'N/A',
        happiness: pokemon.base_happiness ? pokemon.base_happiness : 0,
        captureRate: pokemon.capture_rate ? pokemon.capture_rate : 0
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
        return makeApiCall();
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
        return makeApiCall();
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
