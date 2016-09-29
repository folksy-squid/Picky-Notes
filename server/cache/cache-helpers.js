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
  .then(() => cb && cb());
};

const addNoteToCache = (pathUrl, userId, note, cb) => {
  cache.rpush(`${userId}:${pathUrl}`, JSON.stringify(note))
  .then(() => cache.lrange(`${userId}:${pathUrl}`, -1, -1))
  .then((note) => cb && cb(JSON.parse(note[0])));
  // .then(() => cache.lrange(`${userId}:${pathUrl}`, 0, -1))
  // .then((data) => console.log(data));
};

/************************* DEV *************************/

const deleteAllNotes = (pathUrl) => {
  var pipeline = cache.pipeline();
  getUsersFromRoom(pathUrl)
  .then((allUserIds) => {
    allUserIds.forEach((userId) => {
      cache.del(`${userId}:${pathUrl}`);
    });
  });
};

const getUsersFromRoom = pathUrl => cache.smembers(pathUrl);

// const getNotesFromUser = (pathUrl, userId) =>
//   cache.lrange(`${userId}:${pathUrl}`, 0, -1)
//   .then((notes) => notes.map( note => JSON.parse(note) ));

const getNotesFromRoom = (pathUrl, cb) => {
  // getUsersFromRoom
  var pipeline = cache.pipeline();
  getUsersFromRoom(pathUrl)
  .then((allUserIds) => {
    allUserIds.forEach((userId) => {
      pipeline.lrange(`${userId}:${pathUrl}`, 0, -1);
    });
    pipeline.exec()
    .then((results) => cb(results[0][1].map(note => JSON.parse(note))));
  });
  // iterate through users in room
  // do something
  // delete Notes From user
};

module.exports = {
  addUserToCache,
  addNoteToCache,
  getNotesFromRoom,
};
