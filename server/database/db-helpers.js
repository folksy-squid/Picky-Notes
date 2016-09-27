const md5 = require('js-md5');
const {User, Room, Note} = require('./db-config');

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
        note.setEditingUser(user);
        note.setRoom(room);
        cb(note);
      });
    });
  });
};

module.exports = {
  createNewRoom,
  createNewNote
};
