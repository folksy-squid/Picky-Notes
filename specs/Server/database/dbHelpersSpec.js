const {createNewRoom, generatePathUrl, joinRoom, createNewNote, multiplyNotes, createRoomNotes, showAllNotes, showFilteredNotes, findRoom, updateNotes, getAllUserRooms, getRoom, saveAudioToRoom, saveStartTimestamp, saveTimeLength, getAudioForRoom } = require('../../../server/database/db-helpers');
const {User, Room, Note, db} = require('../../../server/database/db-config');
const expect = require('chai').expect;

/**************Test Data***************/
const testUser = {
  id:,
  facebookId:,
  name:,
  email:,
  pictureUrl:,
  gender: 'Male'
};
const testRoom = {
  topic: 'Data Structures',
  className: 'Hack Reactor',
  lecturer: 'Allen Price',
  hostId: 42
};
/**************************************/

xdescribe('createNewRoom', () => {

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

  beforeEach((done) => {
    createNewRoom(testRoom, (roomInfo) => {
      createdTestRoom = roomInfo.dataValues;
      done();
    });
  });

  afterEach((done) => {
    Room.destroy({ where: createdTestRoom})
    .then(() => done());
  });

  it('should create a new room in the database', () => {
    Room.findOne({ where: testRoom })
    .then((found) => {
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
    console.log(testPathUrl);
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

describe('joinRoom', () => {
  beforeEach((done) => {

  });

  afterEach((done) => {

  });

  it('should associate the given user and room via pathUrl', () => {

  });
});

xdescribe('createNewNote', () => {});
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
