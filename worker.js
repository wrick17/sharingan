onmessage = function(e) {
  var results = e.data;

  var pokemons = results.map(function(pokemon) {

    var url = pokemon.url;
    var match = /https:\/\/pokeapi.co\/api\/v2\/pokemon\/([0-9]{0,})+\//gi.exec(url);
    var id = match[1];

    return {
      id: id,
      url: url,
      name: pokemon.name,
      image: 'https://pokeapi.co/media/sprites/pokemon/' + id + '.png'
    }
  })

  postMessage(pokemons);
}
