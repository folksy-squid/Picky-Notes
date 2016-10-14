/*jshint esversion: 6 */
const md5 = require('js-md5');
const {User, Room, Note, db} = require('./db-config');

const createNewRoom = ({topic, className, lecturer, hostId}, cb) => {

  const pathUrl = generatePathUrl(topic + className + lecturer + hostId);

  Room.create({
    pathUrl: pathUrl,
    topic: topic,
    className: className,
    lecturer: lecturer,
    hostId: hostId
  })
  .then(roomInfo => cb(roomInfo));
};

const generatePathUrl = data => md5(data + Math.random()).slice(0, 5);

const joinRoom = (userId, pathUrl, cb) => {
  User.findById(userId)
  .then(currentUser => {
    Room.findOne({ where: { pathUrl: pathUrl } })
    .then(currentRoom => {
      currentUser.addRoom(currentRoom)
      .then(() => cb(currentRoom));
    });
  });
};

const createNewNote = (note, cb) => {
  note.editingUserId = note.originalUserId;
  note.show = true;

  Note.create(note)
  .then(cb)
  .catch(cb);
};

const multiplyNotes = (notes, arrOfClients) => {
  let multipliedNotes = [];
  for (let i = 0; i < notes.length; i++) {
    for (let j = 0; j < arrOfClients.length; j++) {
      if (notes[i].originalUserId !== Number(arrOfClients[j]) && !notes[i].thought) {
        var copy = JSON.parse(JSON.stringify(notes[i]));
        copy.editingUserId = arrOfClients[j];
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
    // .then(data => console.log('notes deleted:', data));
  };

  for (let i = 0; i < allNotes.length; i++) {
    promises.push(updateOneNote(allNotes[i]));
  }

  Promise.all(promises).then((data) => {
    cb(null);
  }, error => {
    console.log('ERROR', error);
    cb(error);
  });
};

const findRoom = (pathUrl, cb) => {
  Room.findOne({ where: {pathUrl: pathUrl} })
  .then(cb);
};

const getAllUserRooms = (userId, cb) => {
  User.findById(userId)
  .then((user) => user.getRooms({raw: true}))
  .then(cb);
};

const getRoom = (pathUrl, userId, cb) => {
  User.findById(userId)
  .then((user) => user.getRooms({where: {pathUrl: pathUrl}, raw: true}))
  .then((room) => {
    // can be optimized with promises... nice to have later
    getRoomParticipants(pathUrl, ({users}) => {
      cb({ roomInfo: room[0], participants: users });
    });
  });
};

const saveAudioToRoom = (pathUrl, audioUrl, cb) => {
  Room.update({audioUrl: audioUrl}, {where: {pathUrl: pathUrl}})
  .then(cb);
};

const saveStartTimestamp = (pathUrl, startTimestamp) => {
  Room.update({startTimestamp}, {where: {pathUrl}});
};

const saveTimeLength = (pathUrl, endTimestamp) => {

  Room.findOne({where: {pathUrl}})
  .then(room => callback(room.startTimestamp));

  var callback = (start) => {
    let timeLength = endTimestamp - start;
    Room.update({timeLength}, {where: {pathUrl}});
  };

};

const getAudioForRoom = (pathUrl, cb) => {
  Room.findOne({ where: { pathUrl }, raw: true})
  .then(room => cb(room.audioUrl));
};

const deleteNotes = (noteIds, cb) => {
  const promises = noteIds.map((id) => {
    return Note.destroy({ where: {id} });
  });

  Promise.all(promises)
  .then( data => cb(null, data), cb );
};

const getRoomParticipants = (pathUrl, cb) => {
  Room.findOne({
    attributes: [],
    where: { pathUrl },
    include: {
      model: User,
      through: { attributes: [] }
    }
  })
  .then(cb);
};

const deleteNotebook = (userId, roomId, cb) => {
  User.findById(userId)
  .then((user) => user.removeRoom(roomId))
  .then(cb);
};

module.exports = {
  createNewRoom,
  generatePathUrl,
  joinRoom,
  showAllNotes,
  showFilteredNotes,
  findRoom,
  createRoomNotes,
  multiplyNotes,
  updateNotes,
  getAllUserRooms,
  getRoom,
  saveAudioToRoom,
  createNewNote,
  saveStartTimestamp,
  saveTimeLength,
  getAudioForRoom,
  deleteNotes,
  deleteNotebook,
};
