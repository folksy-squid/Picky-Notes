const cache = require('./cache-config');

const addUserToCache = (pathUrl, userId, cb) => {
  cache.sadd(pathUrl, userId)
  .then(() => cb && cb());
};

const addNoteToCache = (pathUrl, userId, note, cb) => {
  cache.get(`${pathUrl}:START`)
  .then((startTime) => {
    note.audioTimestamp = Date.now() - startTime;
    note.show = true;
    note.originalUserId = userId;
    note.editingUserId = note.originalUserId;
    cache.rpush(`${userId}:${pathUrl}`, JSON.stringify(note))
    .then(() => cache.lrange(`${userId}:${pathUrl}`, -1, -1))
    .then((note) => cb && cb(JSON.parse(note[0])));
    // .then(() => cache.lrange(`${userId}:${pathUrl}`, 0, -1))
    // .then((data) => console.log(data));
  });
};

/************************* DEV *************************/

const deleteAllNotesAndRoom = (pathUrl) => {
  getUsersFromRoom(pathUrl)
  .then((allUserIds) => {
    let pipeline = cache.pipeline();
    pipeline.del(pathUrl);
    pipeline.del(`${pathUrl}:START`);
    allUserIds.forEach((userId) => {
      pipeline.del(`${userId}:${pathUrl}`);
    });
    pipeline.exec();
  });
};

const getUsersFromRoom = pathUrl => cache.smembers(pathUrl);


const getNotesFromRoom = (pathUrl, cb) => {
  // getUsersFromRoom
  var pipeline = cache.pipeline();
  getUsersFromRoom(pathUrl)
  .then((allUserIds) => {
    allUserIds.forEach((userId) => {
      pipeline.lrange(`${userId}:${pathUrl}`, 0, -1);
    });
    pipeline.exec()
    .then((results) => {
      cb(results.reduce((p, c) => {
        return p.concat(c[1]);
      }, []).map((note) => {
        return JSON.parse(note);
      }));
    });
  });
  // iterate through users in room
  // do something
  // delete Notes From user
};

const addTimestampToCache = (pathUrl, startTime) => {
  cache.set(`${pathUrl}:START`, startTime);
};

const getNotesFromUser = (pathUrl, userId, cb) => {
  cache.lrange(`${userId}:${pathUrl}`, 0, -1)
  .then((notes) => notes.map((note) => JSON.parse(note)))
  .then((notes) => cb(notes));
};

module.exports = {
  addUserToCache,
  addNoteToCache,
  getNotesFromRoom,
  deleteAllNotesAndRoom,
  addTimestampToCache,
  getUsersFromRoom,
  getNotesFromUser,
};
