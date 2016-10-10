/*jshint esversion: 6 */
const express = require('express');
const {db} = require('./database/db-config');

const app = express();

// add middleware
require('./config/middleware.js')(app, express);

// set port depending on prod or dev
const port = process.env.NODE_ENV === 'production' ? 80 : 3000;

process.env.NODE_ENV !== 'test' && db.sync();

var lex = require('letsencrypt-express').create({
  // set to https://acme-v01.api.letsencrypt.org/directory in production
  server: 'staging'

// If you wish to replace the default plugins, you may do so here
//
// You probably wouldn't need to replace the default sni handler
// See https://github.com/Daplie/le-sni-auto if you think you do
//, sni: require('le-sni-auto').create({})

, approveDomains: approveDomains
});
function approveDomains(opts, certs, cb) {
  // This is where you check your database and associated
  // email addresses with domains and agreements and such


  // The domains being approved for the first time are listed in opts.domains
  // Certs being renewed are listed in certs.altnames
  if (certs) {
    opts.domains = certs.altnames;
  }
  else {
    opts.email = 'kunalrathi1994@gmail.com';
    opts.agreeTos = true;
  }

  cb(null, { options: opts, certs: certs });
}
// handles acme-challenge and redirects to https
require('http').createServer(lex.middleware(require('redirect-https')())).listen(80, function () {
  console.log("Listening for ACME http-01 challenges on", this.address());
});

// handles your app
const listen = require('https').createServer(lex.httpsOptions, lex.middleware(app)).listen(443, function () {
  console.log("Listening for ACME tls-sni-01 challenges and serve app on", this.address());
});


const ioServer = require('./sockets/io.js')(listen);
require('./config/routes.js')(app, express, ioServer);


// add routes

module.exports = {app, ioServer};
