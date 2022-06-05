/*jshint esversion: 6 */
const {createNewRoom, joinRoom, createNewNote, showAllNotes, showFilteredNotes, updateNotes, getAllUserRooms, getRoom, saveAudioToRoom, findRoom, deleteNotes, deleteRoom} = require ('../database/db-helpers');
const passport = require('./passport');
const path = require('path');
const audioUpload = require('./audioUpload');

module.exports = (app, express, io) => {

  /******************** Authentication Endpoints ********************/

  // Facebook OAuth
  app.get('/auth/facebook',
    passport.authenticate('facebook', {
      scope: ['public_profile', 'email', 'user_gender', 'user_friends']
    })
  );
  // Facebook OAuth Callback
  app.get('/auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/login' }), (req, res) => {
      res.cookie('authenticate', req.session.passport); // set authenticated cookie
      res.redirect('/');                    // redirect to homepage (notebook view)
    }
  );
  // Logout
  app.get('/logout', (req, res) => {
    req.logout();       // destroy session/cookie
    res.redirect('/');  // redirerect to homepage (landing view)
  });

  /********************************************************************/

  /******************** User Information Endpoints ********************/

  app.route('/api/users/:userId')
  .get((req, res) => {
    // Retrieve All Rooms belonging to User
    getAllUserRooms(req.params.userId, allUserRooms => res.send(allUserRooms));
  });
  /***** Later Features To Add for User Profiles *****/
  // .put((req, res) => {
  //   res.send('Update the info for user #' + req.params.userId);
  // })
  // .delete((req, res) => {
  //   res.send('Delete user #' + req.params.userId);
  // });

  /********************************************************************/

  /******************** Room Information Endpoints ********************/

  app.route('/api/rooms/')
  .post((req, res) => {
    if (req.query.pathUrl) {
      // Have user join the room at pathUrl
      // And send back room info back to client-side
      joinRoom(req.body.userId, req.query.pathUrl, (currentRoom) => res.send(currentRoom));
    } else {
      // create room from data from user and send back new room info
      req.body ? createNewRoom(req.body, (roomInfo) => res.send(roomInfo)) : res.status(404).send();
    }
  })
  .get((req, res) => {
    // retrieve specific room information at PathUrl for the user
    getRoom(req.query.pathUrl, req.query.userId, room => res.send(room));
  })
  .delete((req, res) => {
    // delete notebook for specific user at roomId
    // (used for notebook view to delete notebook)
    deleteRoom(req.query.userId, req.query.roomId, found => {
      if (!found) { res.status(400).send('Room Not Found'); }
      res.status(204).send();
    });
  });

  app.get('/api/room/status', (req, res) => {
    // check for active lecture (socket room) and return status
    res.status(201).send({active: !!io.sockets.adapter.rooms[req.body.pathUrl]});
  });

  /*********************************************************************/

  /******************** Audio Information Endpoints *********************/

  app.get('/api/audio/:pathUrl', (req, res) => {
    // retrieve audio url from database for room at pathUrl
    findRoom(req.params.pathUrl, room => res.send(room.audioUrl));
  });

  /*********************************************************************/

  /******************** Note Information Endpoints *********************/

  app.post('/api/notes/create', (req, res) => {
    // Note Creation
    // pass the notes in cache (redis) to database (postgres)
    createNewNote(req.body, newNote => res.send(newNote));
  });

  app.route('/api/notes/:userId/:roomId')
  .get((req, res) => {
    if (req.query.filter === 'show') {
      // for Review View
      // if query comes with show, send client only notes that have prop of 'show: true'
      showFilteredNotes(req.params, allNotes => res.send(allNotes));
    } else {
      // for Compile view
      // send client all note associated to room
      showAllNotes(req.params, allNotes => res.send(allNotes));
    }
  })
  .put((req, res) => {
    // Note Editing
    // accepts in req.body an array of notes to update
    // [{id, show, content}]
    updateNotes(req.params, req.body, err => {
      if (err) { res.status(400).send({ text: 'Bad Update Note Request', error: err }); }
      res.status(204).send();
    });
  })
  .delete((req, res) => {
    // Note Deletion
    // accepts in req.body an array of note ids to delete
    deleteNotes(req.body, err => {
      if (err) { res.status(404).send(err); }
      res.status(204).send();
    });
  });

  /*********************************************************************/

  /*********************** Static File Endpoints ***********************/

  app.get('*/index.bundle.js', function (request, response) {
    response.sendFile(path.resolve(__dirname, '../../dist/index.bundle.js'));
  });

  app.get('*/landing.js', function (request, response) {
    response.sendFile(path.resolve(__dirname, '../../client/src/landing.js'));
  });

  app.get('*/scrollStuff.js', function (request, response) {
    response.sendFile(path.resolve(__dirname, '../../client/src/scrollStuff.js'));
  });

  app.get('*/style.css', function (request, response) {
    response.sendFile(path.resolve(__dirname, '../../client/styles/style.css'));
  });

  app.get('*/w3schools.css', function (request, response) {
    response.sendFile(path.resolve(__dirname, '../../client/styles/w3schools.css'));
  });

  app.get('*', function(request, response) {
    response.sendFile(path.resolve(__dirname, '../../client', 'index.html'));
  });
  /*********************************************************************/
};
