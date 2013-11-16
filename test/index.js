var async = require('async');
var express = require('express');
var supertest = require('supertest');

describe('basicAuth middleware tests', function() {

  var USERNAME = 'user';
  var PASSWORD = 'pass';

  describe('no use basicAuth', function() {
    var app = express();
    app.get('/', function(req, res) { res.send('Root'); });
    app.get('/hello', function(req, res) { res.send('Hello'); });

    describe('GET /', function() {
      it('should return 200 "Root"', function(done) {
        supertest(app).get('/').expect(200).expect('Root', done);
      });
    });

    describe('GET /', function() {
      it('should return 200 "Hello"', function(done) {
        supertest(app).get('/hello').expect(200).expect('Hello', done);
      });
    });
  });

  describe('app.use(express.basicAuth())', function() {
    var app = express();
    app.use(express.basicAuth(USERNAME, PASSWORD));
    app.get('/', function(req, res) { res.send('Root'); });
    app.get('/hello', function(req, res) { res.send('Hello'); });

    describe('without auth', function() {
      describe('GET /', function() {
        it('should return 401', function(done) {
          supertest(app).get('/').expect(401, done);
        });
      });

      describe('GET /hello', function() {
        it('should return 401', function(done) {
          supertest(app).get('/hello').expect(401, done);
        });
      });
    });

    describe('with auth', function() {
      describe('GET /', function() {
        it('should return 200 "Root"', function(done) {
          supertest(app).get('/').auth(USERNAME, PASSWORD).expect(200).expect('Root', done);
        });
      });

      describe('GET /hello', function() {
        it('should return 200 "Hello"', function(done) {
          supertest(app).get('/hello').auth(USERNAME, PASSWORD).expect(200).expect('Hello', done);
        });
      });
    });
  });

  describe('app.get("/", express.basicAuth(), ...)', function() {
    var app = express();
    app.get('/', express.basicAuth(USERNAME, PASSWORD), function(req, res) { res.send('Root'); });
    app.get('/hello', function(req, res) { res.send('Hello'); });

    describe('without auth', function() {
      describe('GET /', function() {
        it('should return 401', function(done) {
          supertest(app).get('/').expect(401, done);
        });
      });

      describe('GET /hello', function() {
        it('should return 200 "Hello"', function(done) {
          supertest(app).get('/hello').expect(200).expect('Hello', done);
        });
      });
    });

    describe('with auth', function() {
      describe('GET /', function() {
        it('should return 200 "Root"', function(done) {
          supertest(app).get('/').auth(USERNAME, PASSWORD).expect(200).expect('Root', done);
        });
      });
      describe('GET /hello', function() {
        it('should return 200 "Hello"', function(done) {
          supertest(app).get('/hello').auth(USERNAME, PASSWORD).expect(200).expect('Hello', done);
        });
      });
    });
  });

});


