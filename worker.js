onmessage = function(e) {
  const results = e.data;

  const pokemons = results.map(pokemon => {

    const url = pokemon.url;
    const match = /https:\/\/pokeapi.co\/api\/v2\/pokemon\/([0-9]{0,})+\//gi.exec(url);
    const id = match[1];

    return {
      id,
      url,
      name: pokemon.name,
      image: 'https://pokeapi.co/media/sprites/pokemon/' + id + '.png'
    }
  })

  postMessage(pokemons);
}
