const {createNewRoom, generatePathUrl, joinRoom, createNewNote, multiplyNotes, createRoomNotes, showAllNotes, showFilteredNotes, findRoom, updateNotes, getAllUserRooms, getRoom, saveAudioToRoom, saveStartTimestamp, saveTimeLength, getAudioForRoom } = require('../../../server/database/db-helpers');
const {User, Room, Note, db} = require('../../../server/database/db-config');
const expect = require('chai').expect;

const testUser1 = {
  id: 4242,
  facebookId: '123456789519519',
  name: 'TestUser1',
  email: 'testuser1@email.com',
  pictureUrl: 'www.picture.com/test1',
  gender: 'Male'
};

const testUser2 = {
  id: 3131,
  facebookId: '0987654321',
  name: 'TestUser2',
  email: 'testuser2@email.com',
  pictureUrl: 'www.picture.com/test2',
  gender: 'Female'
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

const testNote1 = {
  content: 'TestNote1',
  thought: false,
  audioTimestamp: '2248',
  show: true,
  originalUserId: testUser1.id,
};

const testNote2 = {
  content: 'TestNote2',
  thought: false,
  audioTimestamp: '4605',
  show: true,
  originalUserId: testUser2.id,
};

const testNote3 = {
  content: 'TestNote3',
  thought: true,
  audioTimestamp: '4605',
  show: true,
  originalUserId: testUser1.id,
};

beforeEach(done => {
  User.destroy({ where: testUser1 })
  .then(() => User.destroy({ where: testUser2 }))
  .then(() => Room.destroy({ where: testRoom }))
  .then(() => Note.destroy({ where: { content: 'TestNote1' } }))
  .then(() => Note.destroy({ where: { content: 'TestNote2' } }))
  .then(() => Note.destroy({ where: { content: 'TestNote3' } }))
  .then(() => done())
  .catch(done);
});

describe('createNewRoom', () => {

  const testRoom = {
    topic: 'Data Structures',
    className: 'Hack Reactor',
    lecturer: 'Allen Price',
    hostId: 4242
  };

  let createdTestRoom;

  beforeEach(done => {
    createNewRoom(testRoom, roomInfo => {
      createdTestRoom = roomInfo.dataValues;
      done();
    });
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

describe('generatePathUrl', () => {

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

describe('joinRoom', () => {

  let createdTestUser, createdTestRoom, foundRoomInfo;

  beforeEach(done => {
    User.create(testUser1)
    .then((user) => createdTestUser = user.dataValues)
    .then(() => Room.create(testRoom))
    .then((room) => createdTestRoom = room.dataValues)
    .then(() => joinRoom(testUser1.id, testRoom.pathUrl, (data) => {
      foundRoomInfo = data.dataValues;
      done();
    }))
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

  const testNote = {
    content: 'TestNote',
    thought: false,
    audioTimestamp: '2248',
    originalUserId: 4242,
    roomId: 5353
  };

  let createdTestNote;

  beforeEach(done => {
    Note.destroy({ where: testNote })
    .then(() => User.create(testUser1))
    .then(() => Room.create(testRoom))
    .then(() => createNewNote(testNote, data => {
      createdTestNote = data.dataValues;
      done();
    }))
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

    // defaults from note creation
    expect(createdTestNote.show).to.be.true;
    expect(createdTestNote.editingUserId).to.equal(testNote.originalUserId);
  });

});

describe('multiplyNotes', () => {
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

describe('createRoomNotes', () => {

  const testNotes = [testNote1, testNote2, testNote3];

  let allNotes = [];

  beforeEach(done => {
    User.create(testUser1)
    .then(() => User.create(testUser2))
    .then(() => Room.create(testRoom))
    .then(() => createRoomNotes(testNotes, 5353, ['4242', '3131'], grabAllNotes))
    .catch(err => done(err));

    const grabAllNotes = () => {
      let grabNotes = [];
      grabNotes.push(Note.findAll({ where: { content: 'TestNote1' }, raw: true }));
      grabNotes.push(Note.findAll({ where: { content: 'TestNote2' }, raw: true }));
      grabNotes.push(Note.findAll({ where: { content: 'TestNote3' }, raw: true }));
      Promise.all(grabNotes)
      .then(data => {
        allNotes = data;
        done();
      })
      .catch(err => done(err));
    };

  });

  it('should bulk create all notes', () => {
    expect(allNotes).to.have.lengthOf(3);
    expect(allNotes[0]).to.have.lengthOf(2);
    expect(allNotes[1]).to.have.lengthOf(2);
    expect(allNotes[2]).to.have.lengthOf(1);
  });

  it('should add roomId to notes', () => {
    allNotes.forEach(noteArr => noteArr.forEach(note => expect(note.roomId).to.exist));
  });

});
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
