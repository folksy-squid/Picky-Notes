/*jshint esversion: 6 */
const md5 = require('js-md5');
const {User, Room, Note, db} = require('./db-config');


/****************************** Room Helpers ******************************/
const createNewRoom = ({topic, className, lecturer, hostId}, cb) => {

  // generate unique PathUrl
  const pathUrl = generatePathUrl(topic + className + lecturer + hostId);

  // Create Room
  Room.create({
    pathUrl: pathUrl,
    topic: topic,
    className: className,
    lecturer: lecturer,
    hostId: hostId
  })
  .then(roomInfo => cb(roomInfo));
};

// generate PathUrl hash with md5
const generatePathUrl = data => md5(data + Math.random()).slice(0, 5);

// save audio url from S3 to room in database
const saveAudioToRoom = (pathUrl, audioUrl, cb) => {
  Room.update({audioUrl}, {where: { pathUrl }})
  .then(cb).catch(cb);
};

// at start of lecture, save the start time-stamp to reference for time length
const saveStartTimestamp = (pathUrl, startTimestamp) => {
  Room.update({startTimestamp}, {where: { pathUrl }});
};

// calculate the length of the lecture based on the end of lecture
const saveTimeLength = (pathUrl, endTimestamp) => {
  findRoom(pathUrl, room => {
    let timeLength = endTimestamp - room.startTimestamp;
    Room.update({ timeLength }, {where: { pathUrl }});
  });
};

// helper function to find room info
const findRoom = (pathUrl, cb) => {
  Room.findOne({ where: { pathUrl } })
  .then(cb).catch(cb);
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
  .then(cb).catch(cb);
};

/**************************************************************************/

/****************************** Note Helpers ******************************/

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

const updateNotes = ({userId, roomId}, allNotes, cb) => {

  const promises = allNotes.map( note =>
    Note.update(note, {
      where: {
        id: note.id,
        editingUserId: userId,
        roomId: roomId
      }
    })
  );

  Promise.all(promises).then(data => cb(null), cb);
};

const deleteNotes = (noteIds, cb) => {
  const promises = noteIds.map( id => Note.destroy({ where: { id } }));

  Promise.all(promises)
  .then( data => cb(null, data), cb );
};

/**************************************************************************/

/****************************** User Helpers ******************************/

const getAllUserRooms = (userId, cb) => {
  User.findById(userId)
  .then(user => user.getRooms())
  .then(cb).catch(cb);
};

const getRoom = (pathUrl, userId, cb) => {
  User.findById(userId)
  .then((user) => user.getRooms({where: {pathUrl}, raw: true}))
  // should be optimized with promises..
  .then((room) => getRoomParticipants(pathUrl, ({users}) => cb({ roomInfo: room[0], participants: users })))
  .catch(cb);
};

const joinRoom = (userId, pathUrl, cb) => {
  User.findById(userId)
  .then(currentUser => {
    Room.findOne({ where: { pathUrl } })
    .then(currentRoom => {
      currentUser.addRoom(currentRoom)
      .then(() => cb(currentRoom));
    });
  });
};

const deleteRoom = (userId, roomId, cb) => {
  User.findById(userId)
  .then((user) => user.removeRoom(roomId))
  .then(cb).catch(cb);
};

/**************************************************************************/

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
  deleteNotes,
  deleteRoom,
};
