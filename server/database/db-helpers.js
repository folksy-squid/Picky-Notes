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
  .spread((user, created) => {
    // created is true  if new user
    // created is false if user already exists
    cb(user, created);
  });
};

const createNewRoom = ({topic, className, lecturer, hostId}, cb) => {
  // { topic, class, lecturer, hostId }
  const pathUrl = md5(topic + className + lecturer + hostId + Date()).slice(0, 5);

  Room.create({
    pathUrl: pathUrl,
    topic: topic,
    class: className,
    lecturer: lecturer,
    hostId: hostId
  })
  .then((roomInfo) => {
    cb(roomInfo);
  });
};

const createNewNote = ({content, roomId, originalUserId}, cb) => {
  // content, audioTimestamp, show, roomId, editingUserId, originalUserId

  User.findOne({
    where: { id: originalUserId }
  })
  .then((user) => {
    Room.findOne({
      where: { id: roomId }
    })
    .then((room) => {
      Note.create({
        content: content,
        audioTimestamp: Date(),
        show: true
      })
      .then((note) => {
        note.setOriginalUser(user);
        note.setEditingUser(user); // alternately, can "Add Note/Notes to User"
        note.setRoom(room); // alternately, can "Add Note/Notes to Room"
        cb(note);
      });
    });
  });
};

const showAllNotes = () => {

};

module.exports = {
  createNewUser,
  createNewRoom,
  createNewNote
};