module.exports = function(app, express) {

  // Facebook OAuth
  app.get('/auth/facebook', function(req, res) {
    res.send('Facebook OAuth');
  });
  app.get('/auth/facebook/callback', function(req, res) {
    res.send('Callback for Facebook OAuth');
  });

  // User Creation
  app.route('/api/users')
    .post(function(req, res) {
      res.send('Create a new user');
    })
    .put(function(req, res) {
      res.send('Update user info');
    })
    .delete(function(req, res) {
      res.send('Delete the user');
    });

  // Room Creation
  app.post('/api/rooms', function(req, res) {
    res.send('Create a room');
  });

  // Note Creation
  app.post('/api/notes/new', function(req, res) {
    res.send('End of lecture, and create all new notes for each user');
  });

  // Note Editing
  app.route('/api/notes')
    .get(function(req, res) {
      /*
       * /api/notes/?userId=id&roomId=id // compare all notes for user
       * /api/notes/?userId=id&roomId=id&filter=show // get all notes for that lecture
       */
      res.send('Compare all notes for the user/room');
    })
    .put(function(req, res) {
      res.send('Edit existing notes (save button)');
    })
    .post(function(req, res) {
      res.send('Add new notes (save button)');
    });
};