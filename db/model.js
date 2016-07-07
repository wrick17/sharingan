const mongoose = require('mongoose');

const models = {};

// pokemons

const PokemonListSchema = new mongoose.Schema({
  _id: String,
  count: Number,
  pokemons: Array,
  expiry: Number
})

const PokemonList = mongoose.model('PokemonList', PokemonListSchema);

const PokemonSchema = new mongoose.Schema({
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

const Pokemon = mongoose.model('Pokemon', PokemonSchema);

// abilities

const AbilityListSchema = new mongoose.Schema({
  _id: String,
  count: Number,
  abilities: Array,
  expiry: Number
})

const AbilityList = mongoose.model('AbilityList', AbilityListSchema);

const AbilitySchema = new mongoose.Schema({
  _id: String,
  id: Number,
  name: String,
  effect: String
})

const Ability = mongoose.model('Ability', AbilitySchema);

// moves

const MoveListSchema = new mongoose.Schema({
  _id: String,
  count: Number,
  moves: Array,
  expiry: Number
})

const MoveList = mongoose.model('MoveList', MoveListSchema);

const MoveSchema = new mongoose.Schema({
  _id: String,
  id: Number,
  name: String,
  effect: String,
  accuracy: Number,
  type: String,
  power: Number
})

const Move = mongoose.model('Move', MoveSchema);

module.exports = {
  PokemonList,
  Pokemon,
  AbilityList,
  Ability,
  MoveList,
  Move
};
