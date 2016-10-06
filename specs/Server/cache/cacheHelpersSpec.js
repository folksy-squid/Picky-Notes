const {addUserToCache, addNoteToCache, deleteAllNotesAndRoom, getUsersFromRoom, getNotesFromRoom, addTimestampToCache} = require('../../../server/cache/cache-helpers');
const cache = require('../../../server/cache/cache-config');
const expect = require('chai').expect;

describe('Cache-Helper Functions', () => {

  const pathUrl = 'ABCDE';
  const user1 = 12345;
  const user2 = 67890;
  const testNote = { content: 'This is a test note!' };
  const anotherNote = { content: 'This is another note?' };

  describe('addUserToCache', () => {

    beforeEach((done) => {
      cache.del(pathUrl)
      .then(addUserToCache(pathUrl, user1, done));
    });

    it('should store usernames at the PathUrl and call the callback', (done) => {
      cache.smembers(pathUrl)
      .then((allUsers) => {
        expect(allUsers).to.have.lengthOf(1);
        expect(allUsers[0]).to.equal(String(user1));
      })
      .then(done);
    });

    it('should add multiple users to the same PathUrl', (done) => {
      addUserToCache(pathUrl, user2, () => {
        cache.smembers(pathUrl)
        .then((allUsers) => {
          expect(allUsers).to.have.lengthOf(2);
          expect(allUsers[0]).to.equal(String(user1));
          expect(allUsers[1]).to.equal(String(user2));
        }).then(done);
      });
    });

  });

  describe('addNoteToCache', () => {

    beforeEach((done)=>{
      cache.del(`${user1}:${pathUrl}`, `${pathUrl}:START`)
      .then(() => cache.set(`${pathUrl}:START`, Date.now()))
      .then(() => addNoteToCache(pathUrl, user1, testNote, () => done()));
    });

    it('should add a note to the cache with default values', () => {
      cache.lrange(`${user1}:${pathUrl}`, 0, -1)
      .then((notes) => {
        const cacheNote = JSON.parse(notes[0]);
        expect(notes).to.have.lengthOf(1);
        expect(cacheNote.content).to.equal(testNote.content);
        expect(cacheNote.audioTimestamp).to.be.a.number;
        expect(cacheNote.show).to.be.true;
        expect(cacheNote.originalUserId).to.equal(user1);
        expect(cacheNote.editingUserId).to.equal(user1);
      });
    });

    it('should return the saved note parsed in the callback', () => {
      addNoteToCache(pathUrl, user1, anotherNote, (cacheNote) => {
        expect(cacheNote.content).to.equal(anotherNote.content);
      });
    });

  });

  describe('deleteAllNotesAndRoom', () => {
    beforeEach((done)=>{
      cache.del(pathUrl)
      .then(cache.sadd(pathUrl, user1))
      .then(cache.sadd(pathUrl, user2))
      .then(() => done());
    });
    it('should delete all notes at the PathUrl', () => {});
  });

  describe('getUsersFromRoom', () => {

    beforeEach((done)=>{
      cache.del(pathUrl)
      .then(cache.sadd(pathUrl, user1))
      .then(cache.sadd(pathUrl, user2))
      .then(() => done());
    });

    it('should return all users in a room', (done) => {
      getUsersFromRoom(pathUrl)
      .then((users) => {
        expect(users).to.have.lengthOf(2);
        expect(users).to.include.members([String(user1), String(user2)]);
      })
      .then(done);
    });

  });

  describe('getNotesFromRoom', () => {

    const note1 = {
      content: 'This is such a fun lecture',
      audioTimeStamp: 1,
      show: true,
      originalUserId: user1,
      editingUserId: user1,
    };
    const note2 = {
      content: 'What an interesting topic',
      audioTimeStamp: 2,
      show: true,
      originalUserId: user2,
      editingUserId: user2,
    };

    beforeEach((done)=>{
      cache.del(pathUrl)
      .then(cache.del(`${user1}:${pathUrl}`))
      .then(cache.del(`${user2}:${pathUrl}`))
      .then(cache.sadd(pathUrl, user1))
      .then(cache.sadd(pathUrl, user2))
      .then(cache.rpush(`${user1}:${pathUrl}`, JSON.stringify(note1)))
      .then(cache.rpush(`${user2}:${pathUrl}`, JSON.stringify(note2)))
      .then(() => done());
    });

    it('should return an array of notes for a specific room', (done) => {
      getNotesFromRoom(pathUrl, (notes) => {
        expect(notes).to.have.lengthOf(2);
        expect(notes).to.deep.equal([note1, note2]);
        done();
      });
    });

  });

  describe('addTimestampToCache', () => {

    const now = Date.now();

    beforeEach((done)=>{
      cache.del(`${pathUrl}:START`)
      .then(addTimestampToCache(pathUrl, now))
      .then(() => done());
    });

    it('should add a start time to the specific PathUrl', (done) => {
      cache.get(`${pathUrl}:START`)
      .then((timestamp) => {
        expect(timestamp).to.be.a.number;
        expect(timestamp).to.equal(String(now));
      })
      .then(done);
    });

  });

});
