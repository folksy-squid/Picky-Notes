const dbhelpers = require ('../database/db-helpers');
const passport = require('./passport');

module.exports = (app, express, db) => {
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

  // User Creation
  app.post('/api/users/', (req, res) => {
    dbhelpers.createNewUser(req.body, (user, created) => {
      if (!created) {
        res.send('User already exists!'); // dummy response, can change this
      } else {
        res.send(user); // if new user, send back user data
      }
    });
  });

  // User Info Update
  app.route('/api/users/:userId')
    .get((req, res) => {
      res.send('Retrieve the info for user #' + req.params.userId);
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
    dbhelpers.createNewRoom(req.body, (roomInfo) => res.send(roomInfo));
  });

  app.post('/api/rooms/:pathUrl', (req, res) => {
  // Have user join the room at 'pathUrl'
    dbhelpers.joinRoom(req.body.userId, req.params.pathUrl, (currentRoom) => res.send(currentRoom));
  });

  // Note Creation
  app.post('/api/notes/create', (req, res) => {
    // pass the notes in cache (redis) to database (postgres)
    // {content, audioTimestamp, show, roomId, editingUserId, originalUserId}
    // res.send('End of lecture, and create all new notes for each user');
    dbhelpers.createNewNote(req.body, (newNote) => { res.send(newNote); });
  });

  // Note Editing
  app.route('/api/notes/:userId/:roomId')
    .get((req, res) => {
      if (req.query.filter === 'show') {
        // res.send('Show filtered notes for user #' + req.params.userId + ' inside room #' + req.params.roomId);
        dbhelpers.showFilteredNotes(req.params, (allNotes) => res.send(allNotes));
      } else {
        // res.send('Compare all notes for user #' + req.params.userId + ' inside room #' + req.params.roomId);
        dbhelpers.showAllNotes(req.params, (allNotes) => res.send(allNotes));
      }
    })
    .put((req, res) => {
      // accepts in req.body an array of notes to update
      // [{id, show, content}]
      res.send('Edit existing notes (save button) for user #' + req.params.userId + ' inside room #' + req.params.roomId);
    })
    .post((req, res) => {
      // potentially instead of using this endpoint, reuse /api/notes/create?
      res.send('Add new notes (save button) for user #' + req.params.userId + ' inside room #' + req.params.roomId);
    });
  app.get('*', function (request, response) {
    response.sendFile(path.resolve(__dirname, '../client', 'index.html'));
  });
};
