/*jshint esversion: 6 */
const md5 = require('js-md5');
const {User, Room, Note, db} = require('./db-config');

const createNewUser = ({facebookId, name, email, pictureUrl, gender}, cb) => {

  User.findOrCreate({
    where: {
      facebookId: facebookId
    },
    defaults: {
      name: name,
      email: email,
      pictureUrl: pictureUrl,
      gender: gender
    }
  })
  // created is true  if new user
  // created is false if user already exists
  .spread((user, created) => cb(user, created));
};

const createNewRoom = ({topic, className, lecturer, hostId}, cb) => {
  // { topic, class, lecturer, hostId }
  const pathUrl = md5(topic + className + lecturer + hostId + Math.random()).slice(0, 5);

  Room.create({
    pathUrl: pathUrl,
    topic: topic,
    class: className,
    lecturer: lecturer,
    hostId: hostId
  })
  .then(roomInfo => cb(roomInfo));
};

const joinRoom = (userId, pathUrl, cb) => {
  console.log('this is user Id', userId);
  User.findById(userId)
  .then(currentUser => {
    Room.findOne({ where: { pathUrl: pathUrl } })
    .then(currentRoom => {
      currentUser.addRoom(currentRoom);
      cb(currentRoom);
    });
  });
};

// const createNewNote = ({content, roomId, originalUserId}, cb) => {
//   // content, audioTimestamp, show, roomId, editingUserId, originalUserId
//
//   Note.create({
//     content: content,
//     audioTimestamp: Date(),
//     show: true,
//     originalUserId: originalUserId,
//     editingUserId: originalUserId,
//     roomId: roomId
//   })
//   .then((note) => { cb(note); });
// };

const multiplyNotes = (notes, arrOfClients) => {
  let multipliedNotes = [];
  for (let i = 0; i < notes.length; i++) {
    for (let j = 0; j < arrOfClients.length; j++) {
      if (notes[i].originalUserId !== arrOfClients[j].id) {
        var copy = JSON.parse(JSON.stringify(notes[i]));
        copy.editingUserId = arrOfClients[j].id;
        copy.show = false;
        multipliedNotes.push(copy);
      }
    }
    multipliedNotes.push(notes[i]);
  }
  return multipliedNotes;
};

const createRoomNotes = (notes, roomId, arrOfClients, cb) => {
  notes = notes.map(note => {
    note.roomId = roomId;
    return note;
  });
  notes = multiplyNotes(notes, arrOfClients);
  Note.bulkCreate(notes)
  // .then(() => Note.findAll({raw: true}))
  // .then((allNotes) => console.log('SAVED', allNotes))
  .then(() => cb());
};

const showAllNotes = ({userId, roomId}, cb) => {
  Note.findAll({
    where: { editingUserId: userId },
    include: {
      model: Room,
      where: { id: roomId },
      attributes: []
    }
  })
  .then(allNotes => cb(allNotes));
};

const showFilteredNotes = ({userId, roomId}, cb) => {
  Note.findAll({
    where: {
      editingUserId: userId,
      show: true
    },
    include: {
      model: Room,
      where: { id: roomId },
      attributes: []
    }
  })
  .then(allNotes => cb(allNotes));
};

const updateNotes = (userId, roomId, allNotes, cb) => {
  let promises = [];

  const updateOneNote = note => {
    Note.update(note, { where: {
      id: note.id,
      editingUserId: userId,
      roomId: roomId
    } });
  };

  for (let i = 0; i < allNotes.length; i++) {
    promises.push(updateOneNote(allNotes[i]));
  }

  Promise.all(promises).then((data) => {
    cb(null);
  }, err => {
    console.log('ERROR', error);
    cb(err);
  });
};

const findRoom = (pathUrl, cb) => {
  Room.findOne({ where: {pathUrl: pathUrl} })
  .then(room => cb(room));
};

const getAllUserRooms = (userId, cb) => {
  console.log('the user id', userId);
  User.findById(userId).
  then((user) => {
    user.getRooms({raw: true})
  .then( (rooms) => {
    console.log('these are your rooms', rooms);
    cb(rooms);
    });
  });
};

module.exports = {
  createNewUser,
  createNewRoom,
  joinRoom,
  showAllNotes,
  showFilteredNotes,
  findRoom,
  createRoomNotes,
  multiplyNotes,
  updateNotes,
  getAllUserRooms
};
