const {createNewUser, createNewRoom, joinRoom, showAllNotes, showFilteredNotes, findRoom, createRoomNotes, multiplyNotes, updateNotes, getAllUserRooms, getRoom, saveAudioToRoom, createNewNote, saveStartTimestamp, saveTimeLength, getAudioForRoom } = require('../../../server/database/db-helpers');
const db = ('../../../server/database/db-config');
const expect = require('chai').expect;

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
