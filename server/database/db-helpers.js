const md5 = require('js-md5');
const {User, Room, Note} = require('./db-config');

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
  .then((roomInfo) => cb(roomInfo));
};

const joinRoom = (userId, pathUrl, cb) => {
  User.findById(userId)
  .then((currentUser) => {
    Room.findOne({
      where: { pathUrl: pathUrl }
    })
    .then((currentRoom) => {
      currentUser.addRoom(currentRoom);
      cb(currentRoom);
    });
  });
};

const createNewNote = ({content, roomId, originalUserId}, cb) => {
  // content, audioTimestamp, show, roomId, editingUserId, originalUserId

  Note.create({
    content: content,
    audioTimestamp: Date(),
    show: true,
    originalUserId: originalUserId,
    editingUserId: originalUserId,
    roomId: roomId
  })
  .then((note) => { cb(note); });
};

const createRoomNotes = (notes, roomId, cb) => {
  notes = notes.map(note => {
    note.roomId = roomId;
    return note;
  });
  //console.log('INSIDE CREATE ROOM', notes);
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
  .then((allNotes) => cb(allNotes));
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
  .then((allNotes) => cb(allNotes));
};

const findRoom = (pathUrl, cb) => {
  Room.findOne({ where: {pathUrl: pathUrl} })
  .then((room) => { cb(room.dataValues); });
};

module.exports = {
  createNewUser,
  createNewRoom,
  joinRoom,
  createNewNote,
  showAllNotes,
  showFilteredNotes,
  findRoom,
  createRoomNotes,
};
