/*jshint esversion: 6 */
const {createNewUser, createNewRoom, joinRoom, createNewNote, showAllNotes, showFilteredNotes, updateNotes, getAllUserRooms, getRoom, saveAudioToRoom, getAudioForRoom, deleteNotes} = require ('../database/db-helpers');
const passport = require('./passport');
const path = require('path');
const audioUpload = require('./audioUpload');

module.exports = (app, express, io) => {
  // Facebook OAuth

  app.get('/auth/facebook',
    passport.authenticate('facebook', {
      scope: ['public_profile', 'email', 'user_about_me', 'user_friends']
    }));

  app.get('/auth/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/login' }),
      (req, res) => {
        res.cookie('authenticate', req.session.passport);
        res.redirect('/');
      }
  );

  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

  // User Info Update
  app.route('/api/users/:userId')
    .get((req, res) => {
      if (req.query.pathUrl) {
        getRoom(req.query.pathUrl, req.params.userId, (room) => res.send(room));
      } else {
        res.send('Retrieve the info for user #' + req.params.userId);
      }
    })
    .put((req, res) => {
      res.send('Update the info for user #' + req.params.userId);
    })
    .delete((req, res) => {
      res.send('Delete user #' + req.params.userId);
    });

  // Room Creation
  app.post('/api/rooms', (req, res) => {
    // create and return hash for room path Url
    createNewRoom(req.body, (roomInfo) => res.send(roomInfo));
  });

  app.post('/api/rooms/:pathUrl', (req, res) => {
    // Have user join the room at 'pathUrl'
    joinRoom(req.body.userId, req.params.pathUrl, (currentRoom) => res.send(currentRoom));
  });

  app.get('/api/users/rooms/:userId', (req, res) => {
    getAllUserRooms(req.params.userId, (allUserRooms) => {
      res.send(allUserRooms);
    });
  });

  app.route('/api/rooms/')
    .post((req, res) => {
    // Have user join the room at 'pathUrl'
      joinRoom(req.body.userId, req.query.pathUrl, (currentRoom) => res.send(currentRoom));
    })
    .get((req, res) => {
      getAllUserRooms(req.query.userId, (allUserRooms) => res.send(allUserRooms));
    });

  app.post('/api/room/status', (req, res) => {
    res.status(201).send({active: !!io.sockets.adapter.rooms[req.body.pathUrl]});
  });

  app.get('/api/audio/:pathUrl', (req, res) => {
    getAudioForRoom(req.params.pathUrl, audioUrl => res.send(audioUrl));
  });

  // Note Creation
  app.post('/api/notes/create', (req, res) => {
    // pass the notes in cache (redis) to database (postgres)
    createNewNote(req.body, newNote => res.send(newNote));
  });

  // Note Editing
  app.route('/api/notes/:userId/:roomId')
    .get((req, res) => {
      if (req.query.filter === 'show') {
        showFilteredNotes(req.params, allNotes => res.send(allNotes));
      } else {
        showAllNotes(req.params, allNotes => res.send(allNotes));
      }
    })
    .put((req, res) => {
      // accepts in req.body an array of notes to update
      // [{id, show, content}]
      updateNotes(req.params.userId, req.params.roomId, req.body, (err) => {
        if (err) { res.status(400).send({ text: 'Bad Update Note Request', error: err }); }
        res.status(204).send();
      });
    })
    .delete((req, res) => {
      deleteNotes(req.body, error => {
        if (error) { 
          console.log(error);
          res.status(404).send(error); 
        }
        res.status(204).send();
      });
    });

  app.get('*/index.bundle.js', function (request, response) {
    response.sendFile(path.resolve(__dirname, '../../dist/index.bundle.js'));
  });

  app.get('*/style.css', function (request, response) {
    response.sendFile(path.resolve(__dirname, '../../client/styles/style.css'));
  });
  app.get('*', function(request, response) {
    response.sendFile(path.resolve(__dirname, '../../client', 'index.html'));
  });
};
