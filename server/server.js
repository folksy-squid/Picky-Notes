var express = require('express');
var bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.json());
app.use(express.static(__dirname + '/../client'));

var port = process.env.NODE_ENV === 'production' ? 80 : 3000;

app.listen(port, function() {
  console.log('Server listening on port ' + port);
});

module.exports = app;