/*jshint esversion: 6 */
var request = require('supertest');
var express = require('express');
var expect = require('chai').expect;
var {app, ioServer} = require('../../server/server');
var {db, User, Room, Note} = require('../../server/database/db-config');
var cache = require('../../server/cache/cache-config');
var cacheHelpers = require('../../server/cache/cache-helpers');

var ioClient = require('socket.io-client');
var socketURL = 'http://0.0.0.0:3000';

var options = {
  transports: ['websocket'],
  'force new connection': true
};

var testUser1 = {
  id: 9999,
  facebookId: 12345,
  name: 'Testing McTesty',
  email: 'test@email.com',
  pictureUrl: 'https://www.test.com/picture.jpg',
  gender: 'Male',
  createdAt: new Date(),
  updatedAt: new Date()
};

var testUser2 = {
  id: 6666,
  facebookId: 67890,
  name: 'Speccy McSpec',
  email: 'spec@email.com',
  pictureUrl: 'https://www.spec.com/picture.jpg',
  gender: 'Female',
  createdAt: new Date(),
  updatedAt: new Date()
};

before((done) => {
  db.sync()
  .then(() => {
    User.destroy({where: { id: 9999 } })
    .then(() => User.destroy({where: { id: 6666 } }))
    .then(() => Room.destroy({ where: { hostId: 9999 } }))
    .then(() => cache.del('TESTT'))
    .then(() => cache.del('9999:TESTT'))
    .then(() => cache.del('6666:TESTT'))
    .then(() => User.create(testUser1))
    .then(() => User.create(testUser2))
    .then(() => done());
  });
});

describe('test', () => {
  it('should pass this test', () => expect(true).to.equal.true);
});

describe('/api/rooms/', () => {

  var hash1, hash2;
  var testRoom = {
    topic: 'Data Structures',
    className: 'Hack Reactor',
    lecturer: 'FredZ',
    hostId: 9999
  };

  beforeEach((done) => {
    request(app)
    .post('/api/rooms')
    .send(testRoom)
    .expect((res) => hash2 = res.body.pathUrl)
    .end(done);
  });

  afterEach(() => Room.destroy({ where: { hostId: 9999 } }));

  describe('Room Creation', () => {

    it('should create a entry in the database', () => {
      Room.findOne({ where: { hostId: 9999 } })
      .then((room) => expect(room).to.exist);
    });

    it('should pass back a pathUrl', (done) => {
      request(app)
      .post('/api/rooms')
      .send(testRoom)
      .expect((res) => {
        hash1 = res.body.pathUrl;
        expect(res.body.pathUrl.length).to.equal(5);
      })
      .end(done);
    });
    it('should create a unique hash', () => {
      expect(hash1).to.exist;
      expect(hash2).to.exist;
      expect(hash1).to.not.equal(hash2);
    });
  });
});

xdescribe('/api/notes/', () => {

  var testRoom = {
    id: 12345,
    pathUrl: 'abcde',
    topic: 'Toy Problems',
    class: 'HackReactor',
    lecturer: 'AllenP',
    audioUrl: 'http://www.test.com/audio.mp3',
    hostId: 9999
  };

  beforeEach((done) => {
    Room.create(testRoom)
    .then(() => done());
  });

  afterEach(() => Room.destroy({ where: { id: 12345 } }));

  describe('Note Creation', () => {

    it('should pass back a new note', (done) => {
      request(app)
        .post('/api/notes/create')
        .send({
          content: 'This is marvelous.',
          roomId: 12345,
          originalUserId: 9999
        })
        .expect((res) => {
          expect(res.body.content).to.equal('This is marvelous.');
          expect(res.body.roomId).to.equal(12345);
          expect(res.body.originalUserId).to.equal(9999);
          expect(res.body.editingUserId).to.equal(9999);
          expect(res.body.show).to.be.true;
        })
        .end(done);
    });
  });
});

describe('Server Side Socket Connection', () => {

  var testRoom = {
    id: 12345,
    pathUrl: 'TESTT',
    topic: 'Toy Problems',
    class: 'HackReactor',
    lecturer: 'AllenP',
    audioUrl: 'http://www.test.com/audio.mp3',
    hostId: 9999
  };

  var roomCreator;

  before((done) => {
    Room.destroy({ where: { id: 12345 }})
    .then(() => Room.create(testRoom))
    .then(()=>done());
  });

  beforeEach(() => {
    roomCreator = ioClient.connect(socketURL, options);
    roomCreator.emit('create room', 'TESTT', testUser1);
  });

  afterEach(() => roomCreator.disconnect());

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
    var creatorNote = { content: 'Picky Notes is a collaborative note taking app.' };
    var joinerNote = { content: 'Picky Notes is a collaborative note taking app.' };

    beforeEach(() => {
      joiner = ioClient.connect(socketURL, options);
      roomCreator.on('create room success', () => joiner.emit('join room', 'TESTT', testUser2));
    });

    afterEach(() => joiner.disconnect());

    it('should receive new notes from the client', (done) => {
      roomCreator.on('create room success', () => roomCreator.emit('new note', creatorNote));
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
});
