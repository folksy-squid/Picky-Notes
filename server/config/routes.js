module.exports = (app, express) => {

  // Facebook OAuth
  app.get('/auth/facebook', (req, res) => {
    res.send('Facebook OAuth');
  });
  app.get('/auth/facebook/callback', (req, res) => {
    // res.send('Callback for Facebook OAuth');
    res.redirect('/api/users');
  });

  // User Creation
  app.post('/api/users/', (req, res) => {
    res.send('Create a new user');
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
    res.send('Create a room path url');
  });

  // Note Creation
  app.post('/api/notes/create', (req, res) => {
    // pass the notes in cache (redis) to database (postgres)
    res.send('End of lecture, and create all new notes for each user');
  });

  // Note Editing
  app.route('/api/notes/:userId/:roomId')
    .get((req, res) => {
      if (req.query.filter === 'show') {
        res.send('Show filtered notes for user #' + req.params.userId + ' inside room #' + req.params.roomId);
      } else {
        res.send('Compare all notes for user #' + req.params.userId + ' inside room #' + req.params.roomId);
      }
    })
    .put((req, res) => {
      res.send('Edit existing notes (save button) for user #' + req.params.userId + ' inside room #' + req.params.roomId);
    })
    .post((req, res) => {
      res.send('Add new notes (save button) for user #' + req.params.userId + ' inside room #' + req.params.roomId);
    });
};
