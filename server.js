require('babel-register');

var express = require('express');
var app = express();
var path = require('path');
var compression = require('compression');
var mongoose = require('mongoose');
var controllerMethods = require('./db/controller.js');

mongoose.connect('mongodb://admin:password@ds015325.mlab.com:15325/pokemons');

var pokemonList = [];
var pokemonDetails = [];
var dbFlag = false;

app.use (function (req, res, next) {
  if(req.headers["x-forwarded-proto"] === "https"){
    return next();
  };
  res.redirect('https://'+req.hostname+req.url);
});

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(compression());
app.use(express.static(path.join('./')));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('we\'re connected!');
  dbFlag = true;

  controllerMethods.fetchPokemonList(function(pokemonListData) {
    console.log('pokemon ->', pokemonListData.length);

    controllerMethods.fetchPokemonDetails(pokemonListData, function(pokemonDetailsData) {})
    controllerMethods.fetchPokemonDescription(pokemonListData, function(pokemonDescriptionData) {})
  });

  controllerMethods.fetchAbilityList(function(abilityListData) {
    console.log('ability ->', abilityListData.length);

    controllerMethods.fetchAbilityDetails(abilityListData, function(abilityDetailsData) {})
  });

  controllerMethods.fetchMoveList(function(moveListData) {
    console.log('move ->', moveListData.length);

    controllerMethods.fetchMoveDetails(moveListData, function(moveDetailsData) {})
  });
});

// pokemons

app.get('/pokemons', function(req, res) {
  controllerMethods.getPokemonList(function(pokemonList) {
    res.json(pokemonList);
  });
});

app.get('/pokemonDetails', function(req, res) {
  controllerMethods.getPokemonDetails(function(pokemonDetails) {
    res.send(pokemonDetails);
  });
});

// descriptions

app.get('/pokemonDescriptions', function(req, res) {
  controllerMethods.getPokemonDescriptions(function(pokemonDescriptions) {
    res.send(pokemonDescriptions);
  });
});

// abilities

app.get('/abilities', function(req, res) {
  controllerMethods.getAbilityList(function(abilityList) {
    res.json(abilityList);
  });
});

app.get('/abilityDetails', function(req, res) {
  controllerMethods.getAbilityDetails(function(abilityDetails) {
    res.send(abilityDetails);
  });
});

// moves

app.get('/moves', function(req, res) {
  controllerMethods.getMoveList(function(moveList) {
    res.json(moveList);
  });
});

app.get('/moveDetails', function(req, res) {
  controllerMethods.getMoveDetails(function(moveDetails) {
    res.send(moveDetails);
  });
});

app.listen(process.env.PORT || 3002, function(){
  console.log('server started');
});
