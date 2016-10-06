const {addUserToCache, addNoteToCache, deleteAllNotesAndRoom, getUsersFromRoom, getNotesFromRoom, addTimestampToCache} = require('../../../server/cache/cache-helpers');
const cache = require('../../../server/cache/cache-config');
const expect = require('chai').expect;

describe('Cache-Helper Functions', () => {

  it('should pass', () => {
    expect(true).to.be.true;
  });

  const pathUrl = 'ABCDE';
  const user1 = 12345;
  const user2 = 67890;
  const testNote = { content: 'This is a test note!' };

  describe('addUserToCache', () => {

    beforeEach((done) => {
      cache.del(pathUrl)
      .then(addUserToCache(pathUrl, user1, done));
    });

    it('should store usernames at the PathUrl and call the callback', (done) => {
      cache.smembers(pathUrl)
      .then((allUsers) => {
        expect(allUsers.length).to.equal(1);
        expect(allUsers[0]).to.equal('12345');
      })
      .then(done);
    });

    it('should add multiple users to the same PathUrl', (done) => {
      addUserToCache(pathUrl, user2, () => {
        cache.smembers(pathUrl)
        .then((allUsers) => {
          expect(allUsers.length).to.equal(2);
          expect(allUsers[0]).to.equal('12345');
          expect(allUsers[1]).to.equal('67890');
        })
        .then(done);
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
        expect(notes.length).to.equal(1);
        expect(cacheNote.content).to.equal(testNote.content);
        expect(cacheNote.show).to.equal(true);
        expect(cacheNote.originalUserId).to.equal(user1);
        expect(cacheNote.editingUserId).to.equal(user1);
      });
    });

    it('should return the saved note parsed in the callback', () => {
      const anotherNote = { content: 'This is another note' };
      addNoteToCache(pathUrl, user1, anotherNote, (cacheNote) => {
        expect(cacheNote.content).to.equal(anotherNote.content);
      });
    });
    
  });

  describe('deleteAllNotesAndRoom', () => {
    beforeEach(()=>{
    });
    it('', () => {});
    it('', () => {});
  });

  describe('getUsersFromRoom', () => {
    beforeEach(()=>{});
    it('', () => {});
    it('', () => {});
  });

  describe('getNotesFromRoom', () => {
    beforeEach(()=>{});
    it('', () => {});
    it('', () => {});
  });

  describe('addTimestampToCache', () => {
    beforeEach(()=>{});
    it('', () => {});
    it('', () => {});
  });

});
