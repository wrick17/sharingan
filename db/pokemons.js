var mongoose = require('mongoose');

var PokemonListSchema = new mongoose.Schema({
  _id: String,
  count: Number,
  pokemons: Array,
  expiry: Number
})

var PokemonList = mongoose.model('PokemonList', PokemonListSchema);

module.exports = PokemonList;
