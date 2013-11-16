var express = require('express');
var expressResource = require('express-resource');
var supertest = require('supertest');

describe('basicAuth middleware & express-resource', function() {

  describe('auto-loading', function() {
    var app = express();
    var actions = {
      show: function(req, res) {
        res.send(req.user);
      }
    };
    app.resource('users', actions, { load: function(id, fn) { fn(null, 'bouzuya'); } });

    describe('GET /users/:user', function() {
      it('should return 200 "bouzuya"', function(done) {
        supertest(app)
        .get('/users/1')
        .expect(200)
        .expect('bouzuya', done);
      });
    });
  });

  describe('basicAuth -> autoloading', function() {
    var app = express();
    var actions = {
      show: function(req, res) {
        res.send(req.user);
      }
    };
    app.use(express.basicAuth('user', 'pass'));
    app.resource('users', actions, { load: function(id, fn) { fn(null, 'bouzuya'); } });

    describe('GET /users/:user', function() {
      it('should return 401', function(done) {
        supertest(app)
        .get('/users/1')
        .expect(401, done);
      });
    });
    describe('GET /users/:user with auth', function() {
      it('should return 200 "bouzuya"', function(done) {
        supertest(app)
        .get('/users/1')
        .auth('user', 'pass')
        .expect(200)
        .expect('bouzuya', done);
      });
    });
  });

  describe('autoloading -> basicAuth', function() {
    var app = express();
    var actions = {
      show: function(req, res) {
        res.send(req.user);
      }
    };
    app.resource('users', actions, { load: function(id, fn) { fn(null, 'bouzuya'); } });
    app.use(express.basicAuth('user', 'pass'));

    describe('GET /users/:user', function() {
      it('should return 200 "bouzuya"', function(done) {
        supertest(app)
        .get('/users/1')
        .expect(200)
        .expect('bouzuya', done);
      });
    });
  });
});

