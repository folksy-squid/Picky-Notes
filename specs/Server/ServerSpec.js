var request = require('supertest');
var express = require('express');
var expect = require('chai').expect;
var app = require('../../server/server');
var {db, User} = require('../../server/database/db-config');

// before((done) => {
//   db.sync({force: true})
//   .then(() => {
//     return User.create({
//       facebookId: '10206128224638462',
//       name: 'Kunal Rathi',
//       email: 'volcanic.phoenix@gmail.com',
//       pictureUrl: 'https://scontent-sjc2-1.xx.fbcdn.net/v/t1.0-1/p320x320/735019_3760102334957_1830986009_n.jpg?oh=95f952f6a491fa054cbb85122e45395f&oe=587471E6',
//       gender: 'Male' 
//     });
//   })
//   .then(() => done());
// });

describe('Room Creation', () => {
  it('should pass back a pathUrl to the room', (done) => {
    request(app)
      .post('/api/rooms')
      .send({
        topic: 'Data Structures',
        className: 'Hack Reactor',
        lecturer: 'Fred',
        hostId: 1
      })
      .expect((res) => {
        expect(res.body.pathUrl.length).to.equal(5);
      })
      .end(done);
  });
});

describe('Note Creation', () => {
  it('should pass back a new note', (done) => {
    request(app)
      .post('/api/notes/create')
      .send({
        content: 'This is marvelous',
        roomId: 11,
        originalUserId: 1
      })
      .expect((res) => {
        expect(res.body.content).to.equal('This is marvelous');
        expect(res.body.roomId).to.equal(11);
        expect(res.body.originalUserId).to.equal(1);
        expect(res.body.editingUserId).to.equal(1);
        expect(res.body.show).to.be.true;
      })
      .end(done);
  });
});