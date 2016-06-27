var express = require('express');
var app = express();
var path = require('path');
var compression = require('compression');

app.use(compression());
app.use(express.static(path.join('./')));

app.use (function (req, res, next) {
  if (req.secure) {
    next();
  } else {
    res.redirect('https://' + req.headers.host + req.url);
  }
});

app.get('/', function(req, res) {
   res.sendFile(__dirname + '/index.html');
});

app.listen(process.env.PORT || 3000, function(){
  console.log('server started');
});
