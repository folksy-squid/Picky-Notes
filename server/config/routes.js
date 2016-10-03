/*jshint esversion: 6 */
const {createNewUser, createNewRoom, joinRoom, createNewNote, showAllNotes, showFilteredNotes, updateNotes, getAllUserRooms, getRoom, saveAudioToRoom} = require ('../database/db-helpers');
const passport = require('./passport');
const path = require('path');
const hotreload = require('./hotreload');
const audioUpload = require('./audioUpload');

module.exports = (app, express) => {
  // Facebook OAuth

  // hotreload(app);
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

  // User Creation
  app.post('/api/users/', (req, res) => {
    createNewUser(req.body, (user, created) => {
      if (!created) {
        res.send('User already exists!'); // dummy response, can change this
      } else {
        res.send(user); // if new user, send back user data
      }
    });
  });
  app.get('/api/users/rooms/:userId', (req, res) => {
    getAllUserRooms(req.params.userId, (allUserRooms) => {
      res.send(allUserRooms);
    });
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
    // { topic, className, lecturer, hostId }
    /*** Example Data sent back to Client ***
    {
      "audioUrl": "audio url",
      "id": 10,
      "pathUrl": "65ad3",
      "topic": "Data Structures",
      "class": "Hack Reactor",
      "lecturer": "Fred",
      "hostId": 1,
      "updatedAt": "2016-09-24T22:58:19.623Z",
      "createdAt": "2016-09-24T22:58:19.623Z"
    }
    ******************************************/
    createNewRoom(req.body, (roomInfo) => res.send(roomInfo));
  });

  app.post('/api/rooms/:pathUrl', (req, res) => {
  // Have user join the room at 'pathUrl'
    joinRoom(req.body.userId, req.params.pathUrl, (currentRoom) => res.send(currentRoom));
  });

  app.post('/api/audio/:pathUrl', audioUpload.single('lecture'), function(req, res) {
    saveAudioToRoom(req.params.pathUrl, req.file.location, () => res.status(201).send('Audio was uploaded!'));
  });

  // Note Creation
  app.post('/api/notes/create', (req, res) => {
    // pass the notes in cache (redis) to database (postgres)
    // {content, audioTimestamp, show, roomId, editingUserId, originalUserId}
    // res.send('End of lecture, and create all new notes for each user');
    createNewNote(req.body, (newNote) => res.send(newNote));
  });

  // Note Editing
  app.route('/api/notes/:userId/:roomId')
    .get((req, res) => {
      if (req.query.filter === 'show') {
        // res.send('Show filtered notes for user #' + req.params.userId + ' inside room #' + req.params.roomId);
        showFilteredNotes(req.params, (allNotes) => res.send(allNotes));
      } else {
        // res.send('Compare all notes for user #' + req.params.userId + ' inside room #' + req.params.roomId);
        showAllNotes(req.params, (allNotes) => res.send(allNotes));
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
    .post((req, res) => {
      // potentially instead of using this endpoint, reuse /api/notes/create?
      res.send('Add new notes (save button) for user #' + req.params.userId + ' inside room #' + req.params.roomId);
    });
  app.get('*.mp3', function(request, response) {
    response.sendFile(path.resolve(__dirname, '../../client', 'sample/audio/FlowerDance.mp3'));
  });
  app.get('*/index.bundle.js', function (request, response) {
    response.sendFile(path.resolve(__dirname, '../../client', 'dist/index.bundle.js'));
  });

  app.get('*/index.bundle.js.map', function(request, response) {
    response.sendFile(path.resolve(__dirname, '../../client', 'dist/index.bundle.js.map'));
  });

  app.get('*', function(request, response) {
    response.sendFile(path.resolve(__dirname, '../../client', 'index.html'));
  });
};
