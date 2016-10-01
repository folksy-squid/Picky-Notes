const helpers = require('../../../server/database/db-helpers');
const expect = require('chai').expect;
describe('multiply notes', () => {
  const notes = [
    {originalUserId: 0, editingUserId: 0},
    {originalUserId: 1, editingUserId: 1},
    {originalUserId: 2, editingUserId: 2}
  ];

  const clients = [
    {id: 0},
    {id: 1},
    {id: 2}];

  var test;

  beforeEach(() => {
    test = helpers.multiplyNotes(notes, clients);
  });
  it('should multiply the notes', () =>{
    expect(test.length).to.equal(9);
  });
  it('should not mutate the original notes and clients', () => {
    expect(notes[0].editingUserId).to.equal(0);
    expect(clients[0].id).to.equal(0);
  });
});
