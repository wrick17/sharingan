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
    console.log('pokemon list updated', pokemonListData.length);

    controllerMethods.fetchPokemonDetails(pokemonListData, function(pokemonDetailsData) {})
  });
});

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

app.listen(process.env.PORT || 3002, function(){
  console.log('server started');
});
