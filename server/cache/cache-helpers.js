const cache = require('./cache-config');

const addUserToCache = (pathUrl, userId, cb) => {
  //adds user to cache, associating pathurl and userid.
  cache.sadd(pathUrl, userId)
  .then(() => cb && cb());
};

const addNoteToCache = (pathUrl, userId, note, cb) => {
  cache.get(`${pathUrl}:START`)
  .then((startTime) => {

    // set default values of note
    note.audioTimestamp = Date.now() - startTime;
    note.show = true;
    note.originalUserId = userId;
    note.editingUserId = note.originalUserId;

    // insert stringified note into cache
    cache.rpush(`${userId}:${pathUrl}`, JSON.stringify(note))

    // return most recently inserted note in cache
    .then(() => cache.lrange(`${userId}:${pathUrl}`, -1, -1))
    .then((note) => cb && cb(JSON.parse(note[0])));
  });
};

//  delete all notes and the room. Called after lecture ends and info is stored in postgres.
const deleteAllNotesAndRoom = (pathUrl, cb) => {

  //  get all users from the room
  getUsersFromRoom(pathUrl)
  .then((allUserIds) => {
    let pipeline = cache.pipeline();
    pipeline.del(pathUrl);
    //  delete reference to room being active
    pipeline.del(`${pathUrl}:START`);
    // for each user, delete their info from redis
    allUserIds.forEach((userId) => {
      pipeline.del(`${userId}:${pathUrl}`);
    });
    pipeline.exec()
    .then(() => cb && cb());
  });
};

//  get all user info from room
const getUsersFromRoom = pathUrl => cache.smembers(pathUrl);

//  get all notes from room
const getNotesFromRoom = (pathUrl, cb) => {
  var pipeline = cache.pipeline();
  //  grab user ids
  getUsersFromRoom(pathUrl)
  .then((allUserIds) => {
    allUserIds.forEach((userId) => {
      //  grab all notes associated with each user
      pipeline.lrange(`${userId}:${pathUrl}`, 0, -1);
    });
    pipeline.exec()
    .then((results) => {
      //  reduce all notes into a single array of notes
      cb(results.reduce((p, c) => {
        return p.concat(c[1]);
      }, []).map((note) => {
        //  return json parsed version of notes
        return JSON.parse(note);
      }));
    });
  });
};

//  saves timestamp of the lecture start for note timestamping
const addTimestampToCache = (pathUrl, startTime) => cache.set(`${pathUrl}:START`, startTime);

//  gets all notes for a single user from a single room
const getNotesFromUser = (pathUrl, userId, cb) => {
  //  get all notes for the user
  cache.lrange(`${userId}:${pathUrl}`, 0, -1)
    //  send back parsed version of notes
  .then((notes) => notes.map((note) => JSON.parse(note)))
  .then((notes) => cb(notes));
};

//  get timestamp information for room from cache
const getTimestampFromCache = (pathUrl, cb) => {
  cache.get(`${pathUrl}:START`)
  .then(cb);
};

module.exports = {
  addUserToCache,
  addNoteToCache,
  addTimestampToCache,
  deleteAllNotesAndRoom,
  getUsersFromRoom,
  getNotesFromRoom,
  getNotesFromUser,
  getTimestampFromCache,
};
