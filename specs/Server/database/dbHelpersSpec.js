const {createNewRoom, generatePathUrl, joinRoom, createNewNote, multiplyNotes, createRoomNotes, showAllNotes, showFilteredNotes, findRoom, updateNotes, getAllUserRooms, getRoom, saveAudioToRoom, saveStartTimestamp, saveTimeLength, getAudioForRoom } = require('../../../server/database/db-helpers');
const {User, Room, Note, db} = require('../../../server/database/db-config');
const expect = require('chai').expect;

xdescribe('createNewRoom', () => {

  const testRoom = {
    topic: 'Data Structures',
    className: 'Hack Reactor',
    lecturer: 'Allen Price',
    hostId: 4242
  };

  let createdTestRoom;

  /************* Sample Data ************
  { audioUrl: 'audio url',
    timeLength: null,
    id: 10,
    pathUrl: '68eee',
    topic: 'Data Structures',
    className: 'Hack Reactor',
    lecturer: 'Allen Price',
    hostId: 42,
    updatedAt: 2016-10-12T22:54:38.651Z,
    createdAt: 2016-10-12T22:54:38.651Z,
    startTimestamp: null }
  **************************************/

  beforeEach(done => {
    createNewRoom(testRoom, roomInfo => {
      createdTestRoom = roomInfo.dataValues;
      done();
    })
    .catch((err) => done(err));
  });

  afterEach(done => {
    Room.destroy({ where: createdTestRoom })
    .then(() => done())
    .catch((err) => done(err));
  });

  it('should create a new room in the database', () => {
    Room.findOne({ where: testRoom })
    .then(found => {
      expect(found).to.exist;
    });
  });

  it('should return the room information on success', () => {
    expect(createdTestRoom).to.exist;
    expect(createdTestRoom.topic).to.equal(testRoom.topic);
    expect(createdTestRoom.className).to.equal(testRoom.className);
    expect(createdTestRoom.lecturer).to.equal(testRoom.lecturer);
    expect(createdTestRoom.hostId).to.equal(testRoom.hostId);
  });
});

xdescribe('generatePathUrl', () => {

  let testPathUrl;

  it('should return a string of length 5 of characters and numbers', () => {
    const testPathUrl = generatePathUrl(testRoom.topic + testRoom.className + testRoom.lecturer + testRoom.hostId);
    expect(testPathUrl).to.have.lengthOf(5);
  });

  it('should generate a unique pathUrl when given the same input', () => {
    let arrayPathUrl = {};
    for (let i = 0; i < 100; i++) {
      let testPathUrl = generatePathUrl(testRoom.topic + testRoom.className + testRoom.lecturer + testRoom.hostId);
      arrayPathUrl[testPathUrl] = testPathUrl;
    }
    expect(Object.keys(arrayPathUrl)).to.have.lengthOf(100);
  });
});

xdescribe('joinRoom', () => {

  const testUser = {
    id: 4242,
    facebookId: '123456789519519',
    name: 'TestUser',
    email: 'testuser@email.com',
    pictureUrl: 'www.picture.com/test',
    gender: 'Male'
  };

  const testRoom = {
    id: 5353,
    pathUrl: 'abcde',
    topic: 'Toy Problems',
    className: 'Hack Reactor',
    lecturer: 'Fred',
    audioUrl: 'www.audio.com',
    hostId: 4242
  };

  let createdTestUser, createdTestRoom, foundRoomInfo;

  beforeEach(done => {
    User.destroy({ where: testUser })
    .then(() => Room.destroy({ where: testRoom }))
    .then(() => User.create(testUser))
    .then((user) => createdTestUser = user.dataValues)
    .then(() => Room.create(testRoom))
    .then((room) => createdTestRoom = room.dataValues)
    .then(() => joinRoom(testUser.id, testRoom.pathUrl, (data) => {
      foundRoomInfo = data.dataValues;
      done();
    }));
  });

  afterEach(done => {
    User.destroy({ where: testUser })
    .then(() => Room.destroy({ where: testRoom }))
    .then(() => done())
    .catch(err => done(err));
  });

  it('should associate the given user and room via pathUrl', done => {
    User.findById(4242)
    .then(foundUser => foundUser.getRooms({ attributes: [], raw: true }))
    .then(data => {
      expect(data[0]).to.exist;
      expect(data[0]['UserRoom.userId']).to.equal(4242);
      expect(data[0]['UserRoom.roomId']).to.equal(5353);
    })
    .then(() => done())
    .catch(err => done(err));
  });

  it('should return information about the joined Room', () => {
    expect(foundRoomInfo).to.exist;
    expect(foundRoomInfo.id).to.equal(testRoom.id);
    expect(foundRoomInfo.pathUrl).to.equal(testRoom.pathUrl);
    expect(foundRoomInfo.topic).to.equal(testRoom.topic);
    expect(foundRoomInfo.className).to.equal(testRoom.className);
    expect(foundRoomInfo.lecturer).to.equal(testRoom.lecturer);
    expect(foundRoomInfo.hostId).to.equal(testRoom.hostId);
  });

});

describe('createNewNote', () => {
  const testUser = {
    id: 4242,
    facebookId: '123456789519519',
    name: 'TestUser',
    email: 'testuser@email.com',
    pictureUrl: 'www.picture.com/test',
    gender: 'Male'
  };

  const testRoom = {
    id: 5353,
    pathUrl: 'abcde',
    topic: 'Toy Problems',
    className: 'Hack Reactor',
    lecturer: 'Fred',
    audioUrl: 'www.audio.com',
    hostId: 4242
  };

  const testNote = {
    thought: false,
    content: 'Hello World',
    audioTimestamp: '2432',
    roomId: 5353,
    originalUserId: 4242
  };

  let createdTestNote;

  beforeEach(done => {
    User.destroy({ where: testUser })
    .then(() => Room.destroy({ where: testRoom }))
    .then(() => Note.destroy({ where: testNote }))
    .then(() => User.create(testUser))
    .then(() => Room.create(testRoom))
    .then(() => createNewNote(testNote, (data) => {
      createdTestNote = data.dataValues;
      done();
    }))
    .catch(err => done(err));
  });

  afterEach(done => {
    User.destroy({ where: testUser })
    .then(() => Room.destroy({ where: testRoom }))
    .then(() => Note.destroy({ where: testNote }))
    .then(() => done())
    .catch(err => done(err));
  });

  it('should create a new note in the database', (done) => {
    Note.findOne({ where: testNote })
    .then((found) => {
      expect(found).to.not.be.null;
      done();
    })
    .catch(err => done(err));
  });

  it('should return the note information based on the database', () => {
    expect(createdTestNote.content).to.equal(testNote.content);
    expect(createdTestNote.audioTimestamp).to.equal(testNote.audioTimestamp);
    expect(createdTestNote.thought).to.equal(testNote.thought);
    expect(createdTestNote.roomId).to.equal(testNote.roomId);
    expect(createdTestNote.originalUserId).to.equal(testNote.originalUserId);

    expect(createdTestNote.show).to.be.true;
    expect(createdTestNote.editingUserId).to.equal(testNote.originalUserId);
  });

});

xdescribe('multiplyNotes', () => {
  const notes = [{
    content: 'This is a note for User 0',
    show: true,
    originalUserId: 0,
    editingUserId: 0
  }, {
    content: 'This is a note for User 1',
    show: true,
    originalUserId: 1,
    editingUserId: 1
  }, {
    content: 'This is a note for User 2',
    show: true,
    originalUserId: 2,
    editingUserId: 2
  }];

  const clients = ['0', '1', '2'];

  let test;

  beforeEach(() => {
    test = multiplyNotes(notes, clients);
  });
  it('should multiply the notes', () =>{
    expect(test.length).to.equal(9);
  });
  it('should not mutate the original notes and clients', () => {
    expect(notes[0].editingUserId).to.equal(0);
    expect(clients[0]).to.equal('0');
  });
});

xdescribe('createRoomNotes', () => {});
xdescribe('showAllNotes', () => {});
xdescribe('showFilteredNotes', () => {});
xdescribe('updateNotes', () => {});
// describe('updateOneNote', () => {});
xdescribe('findRoom', () => {});
xdescribe('getAllUserRooms', () => {});
xdescribe('getRoom', () => {});
xdescribe('saveAudioToRoom', () => {});
xdescribe('createNewNote', () => {});
xdescribe('saveStartTimestamp', () => {});
xdescribe('saveTimeLength', () => {});
xdescribe('getAudioForRoom', () => {});
xdescribe('deleteNotes', () => {});
xdescribe('getROomParticipants', () => {});
xdescribe('deleteNotebook', () => {});
