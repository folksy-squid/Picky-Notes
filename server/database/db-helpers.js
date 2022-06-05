/*jshint esversion: 6 */
const md5 = require('js-md5');
const {User, Room, Note, db} = require('./db-config');


/****************************** Room Helpers ******************************/
const createNewRoom = ({topic, className, lecturer, hostId}, cb) => {

  /********* Generate unique PathUrl *********/
  const pathUrl = generatePathUrl(topic + className + lecturer + hostId);

  /********* Create Room *********/
  Room.create({
    pathUrl: pathUrl,
    topic: topic,
    className: className,
    lecturer: lecturer,
    hostId: hostId
  })
  .then(roomInfo => cb(roomInfo));
};

/******* Generate PathUrl hash with md5 ********/
const generatePathUrl = data => md5(data + Math.random()).slice(0, 5);

/********** Save audio url from S3 to room in database ********/
const saveAudioToRoom = (pathUrl, audioUrl, cb) => {
  Room.update({audioUrl}, {where: { pathUrl }})
  .then(cb).catch(cb);
};

/******* At start of lecture, save the start time-stamp to reference for time length ******/
const saveStartTimestamp = (pathUrl, startTimestamp) => {
  Room.update({startTimestamp}, {where: { pathUrl }});
};

/******** Calculate the length of the lecture based on the end of lecture *******/
const saveTimeLength = (pathUrl, endTimestamp) => {
  findRoom(pathUrl, room => {
    let timeLength = endTimestamp - room.startTimestamp;
    Room.update({ timeLength }, {where: { pathUrl }});
  });
};

/******** Helper function to find room info ********/
const findRoom = (pathUrl, cb) => {
  Room.findOne({ where: { pathUrl } })
  .then(cb).catch(cb);
};

/***** Get all users associated with the room *********/
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

/******** Create new notes from compile view into the database ********/
const createNewNote = (note, cb) => {
  note.editingUserId = note.originalUserId;
  note.show = true;

  Note.create(note)
  .then(cb).catch(cb);
};

/******** Create copy of each note for all users *********/
const multiplyNotes = (notes, arrOfClients) => {
  let multipliedNotes = [];
  for (let i = 0; i < notes.length; i++) {
    for (let j = 0; j < arrOfClients.length; j++) {
      if (notes[i].originalUserId !== Number(arrOfClients[j]) && !notes[i].thought) {
        var copy = JSON.parse(JSON.stringify(notes[i]));    // create copy of the note
        copy.editingUserId = arrOfClients[j];               // change editing user id
        copy.show = false;                                  // default show to false for notes
        multipliedNotes.push(copy);                         // store edited notes
      }
    }
    multipliedNotes.push(notes[i]);                         // store original notes
  }
  return multipliedNotes;                                   // return all notes
};

/********Take notes from cache and save into database **********/
const createRoomNotes = (notes, roomId, arrOfClients, cb) => {
  notes = notes.map(note => {
    note.roomId = roomId;                     // map room id to all notes
    return note;
  });
  notes = multiplyNotes(notes, arrOfClients); // multiply notes for each user
  Note.bulkCreate(notes)                      // bulk create notes
  .then(() => cb());
};

/******** Return all notes belonging to User *********/
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

/********* Return all selected notes belonging to user *********/
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

/********* Batch update all notes *********/
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

/********* Batch delete notes *********/
const deleteNotes = (noteIds, cb) => {
  // pass in an array of note ids and promisify the delete actions
  const promises = noteIds.map( id => Note.destroy({ where: { id } }));

  Promise.all(promises)
  .then( data => cb(null, data), cb );
};

/**************************************************************************/

/****************************** User Helpers ******************************/

/********* Get all Rooms associated with User *********/
const getAllUserRooms = (userId, cb) => {
  User.findByPk(userId)
  .then(user => user.getRooms())
  .then(cb).catch(cb);
};
/********* Get Specific Room Info *********/
const getRoom = (pathUrl, userId, cb) => {
  User.findByPk(userId)
  .then((user) => user.getRooms({where: {pathUrl}, raw: true}))
  // should be optimized with promises..
  .then((room) => getRoomParticipants(pathUrl, ({users}) => cb({ roomInfo: room[0], participants: users })))
  .catch(cb);
};

/********* Associate User to Room *********/
const joinRoom = (userId, pathUrl, cb) => {
  User.findByPk(userId)
  .then(currentUser => {
    Room.findOne({ where: { pathUrl } })
    .then(currentRoom => {
      currentUser.addRoom(currentRoom)
      .then(() => cb(currentRoom));
    });
  });
};

/********* Delete Room Association from User *********/
const deleteRoom = (userId, roomId, cb) => {
  User.findByPk(userId)
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
