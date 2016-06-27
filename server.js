var express = require('express');
var app = express();
var http = require('http').Server(app);
var path = require('path');
var compression = require('compression');

app.use(compression());
app.use(express.static(path.join('./')));

app.get('*',function(req,res,next){
  if(req.headers['x-forwarded-proto']!='https')
    res.redirect('https://pwa-pokemons.herokuapp.com/'+req.url)
  else
    next() /* Continue to other routes if we're not redirecting */
})
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

http.listen(process.env.PORT || 3000, function(){
  console.log('server started');
});
