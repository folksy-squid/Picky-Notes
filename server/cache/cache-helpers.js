const {cache} = require('./cache-config');

const test = () => {
  cache.set('newNote', 'a new thing')
  .then(() => cache.get('newNote'))
  .then((data) => {
    console.log(data);
    cache.quit();
  });
};

const addUserToCache = (pathUrl, userId, cb) => {
  cache.sadd(pathUrl, userId)
  .then(() => cb());
};

const addNoteToCache = (pathUrl, userId, note, cb) => {
  cache.rpush(`${userId}:${pathUrl}`, JSON.stringify(note))
  .then(() => cb());
};

module.exports = {
  addUserToCache,
  addNoteToCache
};
