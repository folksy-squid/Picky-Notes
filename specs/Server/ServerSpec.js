/*jshint esversion: 6 */
var request = require('supertest');
var express = require('express');
var expect = require('chai').expect;
var {app, ioServer} = require('../../server/server');
var {db, User, Room, Note} = require('../../server/database/db-config');
var cache = require('../../server/cache/cache-config');
var cacheHelpers = require('../../server/cache/cache-helpers')

var ioClient = require('socket.io-client');
var socketURL = 'http://0.0.0.0:3000';
var options = {
  transports: ['websocket'],
  'force new connection': true
};

before((done) => {
  db.sync()
  .then(() => {
    User.destroy({
      where: {
        id: 9999
      }
    }).then(() => {
      User.create({
        id: 9999,
        facebookId: 12345,
        name: 'Testing McTesty',
        email: 'test@email.com',
        pictureUrl: 'https://www.test.com/picture.jpg',
        gender: 'Male'
      })
      .then(() => done());
    } );
  });
});

after((done) => {
  Note.destroy({ where: { originalUserId: 9999 } })
  .then(() => Room.destroy({ where: { hostId: 9999 } }))
  .then(() => User.destroy({ where: { id: 9999 } }))
  .then(() => cache.del('TESTT'))
  .then(() => cache.del('9999:TESTT'))
  .then(() => done());
});

describe('test', () => {
  it('should pass this test', () => expect(true).to.equal.true);
});

describe('/api/rooms/', () => {

  var hash1, hash2;

  beforeEach((done) => {
    request(app)
      .post('/api/rooms')
      .send({
        topic: 'Data Structures',
        className: 'Hack Reactor',
        lecturer: 'FredZ',
        hostId: 9999
      })
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
        .send({
          topic: 'Data Structures',
          className: 'Hack Reactor',
          lecturer: 'FredZ',
          hostId: 9999
        })
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

describe('/api/notes/', () => {

  beforeEach((done) => {
    Room.create({
      id: 12345,
      pathUrl: 'abcde',
      topic: 'Toy Problems',
      class: 'HackReactor',
      lecturer: 'AllenP',
      audioUrl: 'http://www.test.com/audio.mp3',
      hostId: 9999
    })
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

  before((done) => {
    Room.create({
      id: 12345,
      pathUrl: 'TESTT',
      topic: 'All About Testing',
      class: 'Tests Tests Tests',
      lecturer: 'Mr. Tester',
      audioUrl: 'http:www.test.com/test.mp3',
      hostId: 9999
    })
    .then(()=>done());
  });

  after(() => Room.destroy({ where: { id: 12345 } }));

  it('should connect to incoming sockets', (done) => {
    var client = ioClient.connect(socketURL, options);

    client.on('connect', (d) => {
      client.disconnect();
      done();
    });
  });

  it('should create rooms', (done) => {
    var client = ioClient.connect(socketURL, options);
    client.emit('create room', 'TESTT', 9999);
    client.on('create room success', () => {
      expect(ioServer.sockets.adapter.rooms).to.have.property('TESTT');
      client.disconnect();
      done();
    });
  });

  it('should put users in a room', (done) => {
    var roomCreator = ioClient.connect(socketURL, options);
    roomCreator.emit('create room', 'TESTT', 9999);

    var joiner = ioClient.connect(socketURL, options);
    roomCreator.on('create room success', () => {
      joiner.emit('join room', 'TESTT', 9999);
    });
    joiner.on('join room success', () => {
      expect(ioServer.sockets.adapter.rooms['TESTT'].length).to.equal(2);
      roomCreator.disconnect();
      joiner.disconnect();
      done();
    });
  });

  it('should notify members of a room when a lecture starts', (done) => {
    var roomCreator = ioClient.connect(socketURL, options);
    roomCreator.emit('create room', 'TESTT', 9999);

    roomCreator.on('create room success', () => {
      var joiner = ioClient.connect(socketURL, options);
      joiner.emit('join room', 'TESTT', 9999);

      joiner.on('join room success', () => {
        roomCreator.emit('lecture start');
      });

      joiner.on('lecture started', () => {
        roomCreator.disconnect();
        joiner.disconnect();
        done();
      });
    });
  });

  it('should notify members of a room when a lecture ends', (done) => {
    var roomCreator = ioClient.connect(socketURL, options);
    roomCreator.emit('create room', 'TESTT', 9999);

    roomCreator.on('create room success', () => {
      var joiner = ioClient.connect(socketURL, options);
      joiner.emit('join room', 'TESTT', 9999);

      joiner.on('join room success', () => {
        roomCreator.emit('lecture end');
      });

      joiner.on('lecture ended', () => {
        roomCreator.disconnect();
        joiner.disconnect();
        done();
      });
    });
  });

  it('should receive new notes from the client', (done) => {
    var exampleNote = {
      content: 'Picky Notes is a collaborative note taking app.',
    };
    var roomCreator = ioClient.connect(socketURL, options);
    roomCreator.emit('create room', 'TESTT', 9999);
    roomCreator.emit('new note', exampleNote);
    roomCreator.on('add note success', () => {
      roomCreator.disconnect();
      done();
    });
  });

  it('should emit "all ready" when all sockets are ready', (done) => {
    var roomCreator = ioClient.connect(socketURL, options);
    roomCreator.emit('create room', 'TESTT', 9999);

    var joiner = ioClient.connect(socketURL, options);
    roomCreator.on('create room success', () => {
      joiner.emit('join room', 'TESTT', 9999);
    });
    
    joiner.on('all ready', () => {
      roomCreator.disconnect();
      joiner.disconnect();
      done();
    });

    joiner.on('join room success', () => {
      expect(ioServer.sockets.adapter.rooms['TESTT'].length).to.equal(2);
      roomCreator.emit('user ready');
      joiner.emit('user ready');
    });
  });

  it('should save all notes from cache and retrieve from database', (done) => {
    var roomCreator = ioClient.connect(socketURL, options);
    roomCreator.emit('create room', 'TESTT', 9999);

    var joiner = ioClient.connect(socketURL, options);
    
    roomCreator.on('create room success', () => {
      joiner.emit('join room', 'TESTT', 9999);
    });
    
    joiner.on('all ready', () => {
      roomCreator.disconnect();
      joiner.disconnect();
      done();
    });

    joiner.on('join room success', () => {
      roomCreator.emit('new note', {content: 'I am an awesome note', audioTimeStamp: 1});      
    });

    roomCreator.on('add note success', () => {
      joiner.emit('new note', {content: 'I am an awesome note', audioTimeStamp: 2});
    });
    
    joiner.on('add note success', () => {
      roomCreator.emit('user ready');
      joiner.emit('user ready');
    });

  });
});
