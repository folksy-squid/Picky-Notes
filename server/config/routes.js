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
};