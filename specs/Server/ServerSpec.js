var request = require('supertest');
var express = require('express');
var expect = require('chai').expect;
var app = require('../../server/server');

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
        expect(res.text.length).to.equal(5);
      })
      .end(done);

  });
});