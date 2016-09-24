const express = require('express');
const app = express();

// add middleware
require('./config/middleware.js')(app, express);

// add routes
require('./config/routes.js')(app, express);

// set port depending on prod or dev
const port = process.env.NODE_ENV === 'production' ? 80 : 3000;

app.listen(port, () => {
  console.log('Server listening on port ' + port);
});

module.exports = app;
