const {cache} = require('./cache-config');

const test = () => {
  cache.set('newNote', 'a new thing')
  .then(() => cache.get('newNote'))
  .then((data) => {
    console.log(data);
    cache.quit();
  });
};

const addUserToCacheRoom = (pathUrl, userId, cb) => {
  cache.sadd(pathUrl, userId)
  .then(() => cb());
};

module.exports = {
  addUserToCacheRoom
};
