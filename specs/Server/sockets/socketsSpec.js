const expect = require('chai').expect;
const {ioServer} = require('../../../server/server');
const {db, User, Room, Note} = require('../../../server/database/db-config');

const ioClient = require('socket.io-client');
const socketURL = 'http://0.0.0.0:3000';

const options = {
  transports: ['websocket'],
  'force new connection': true
};

const testUser1 = {
  id: 9999,
  name: 'Testing McTesty',
  email: 'test@email.com',
};

const testUser2 = {
  id: 6666,
  name: 'Speccy McSpec',
  email: 'spec@email.com',
};

const testRoom = {
  id: 12345,
  pathUrl: 'TESTT',
  hostId: 9999
};

let roomCreator;

before((done) => {
  db.sync()
  .then(() => User.destroy({ where: { id: 9999 } }))
  .then(() => User.destroy({ where: { id: 6666 } }))
  .then(() => Room.destroy({ where: { id: 12345 } }))
  .then(() => User.create(testUser1))
  .then(() => User.create(testUser2))
  .then(() => Room.create(testRoom))
  .then(() => done());
});

beforeEach(() => {
  roomCreator = ioClient.connect(socketURL, options);
  roomCreator.emit('create room', 'TESTT', testUser1);
});

afterEach(() => roomCreator.disconnect());

describe('Server Side Socket Connection', () => {

  it('should connect to incoming sockets', (done) => {
    roomCreator.on('connect', () => {
      roomCreator.disconnect();
      done();
    });
  });

  it('should create rooms', (done) => {
    roomCreator.on('create room success', () => {
      expect(ioServer.sockets.adapter.rooms).to.have.property('TESTT');
      done();
    });
    roomCreator.on('create room error', (error) => {
      expect(error).to.not.exist;
      done();
    });
  });

});

describe('Other Users Joining Room', () => {

  var joiner;
  var exampleNote = { content: 'Picky Notes is a collaborative note taking app.' };

  beforeEach(() => {
    joiner = ioClient.connect(socketURL, options);
    roomCreator.on('create room success', () => joiner.emit('join room', 'TESTT', testUser2));
  });

  afterEach(() => joiner.disconnect());

  it('should put users in a room', (done) => {
    joiner.on('join room success', () => {
      expect(ioServer.sockets.adapter.rooms['TESTT'].length).to.equal(2);
      done();
    });
    joiner.on('join room error', (error) => {
      expect(error).to.be.true;
      done();
    });
  });

  it('should notify members of a room when a lecture starts', (done) => {
    joiner.on('join room success', () => roomCreator.emit('lecture start'));
    joiner.on('lecture started', () => done());
  });

  it('should notify members of a room when a lecture ends', (done) => {
    joiner.on('join room success', () => roomCreator.emit('lecture end'));
    joiner.on('lecture ended', () => done());
  });
});

describe('Create Notes', () => {

  var joiner;
  var testNote = { content: 'This is the test note.' };
  var creatorNote = { content: 'Picky Notes is a collaborative note taking app.' };
  var joinerNote = { content: 'This is not a note taking app.' };

  beforeEach(() => {
    joiner = ioClient.connect(socketURL, options);
    roomCreator.on('create room success', () => joiner.emit('join room', 'TESTT', testUser2));
  });

  afterEach(() => joiner.disconnect());

  it('should receive new notes from the client', (done) => {
    roomCreator.on('create room success', () => roomCreator.emit('new note', testNote));
    roomCreator.on('add note success', () => done());
  });

  it('should emit "all ready" when all sockets are ready', (done) => {
    joiner.on('join room success', () => {
      roomCreator.emit('user ready');
      joiner.emit('user ready');
    });
    joiner.on('all ready', () => done());
  });

  it('should save all notes from cache and retrieve from database', (done) => {
    joiner.on('join room success', () => {
      roomCreator.emit('new note', creatorNote);
      joiner.emit('new note', joinerNote);
    });
    joiner.on('add note success', () => {
      roomCreator.emit('user ready');
      joiner.emit('user ready');
    });
    joiner.on('all notes saved', () => done());
  });
});
