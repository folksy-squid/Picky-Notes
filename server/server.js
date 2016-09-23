var express = require('express');

var app = express();

require('./config/middleware.js')(app, express);

var port = process.env.NODE_ENV === 'production' ? 80 : 3000;

app.listen(port, function() {
  console.log('Server listening on port ' + port);
});

module.exports = app;