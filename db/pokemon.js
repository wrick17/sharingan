var mongoose = require('mongoose');

var PokemonSchema = new mongoose.Schema({
  _id: String,
  id: Number,
  name: String,
  types: Array,
  height: Number,
  weight: Number,
  base_experience: Number,
  abilities: Array,
  moves: Array,
  stats: Array
})

var Pokemon = mongoose.model('Pokemon', PokemonSchema);

module.exports = Pokemon;
