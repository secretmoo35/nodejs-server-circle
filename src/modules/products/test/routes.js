'use strict';
var request = require('supertest'),
  assert = require('assert'),
  mongoose = require('mongoose'),
  _model = require('../models/model').model,
  app = require('../../../config/express'),
  Model = mongoose.model(_model),
  User = mongoose.model('User');

var item,
  credentials,
  token;

describe(_model + ' CRUD routes tests', function () {

  before(function (done) {
    item = {
      name: 'Product name',
      image: 'image',
      category: {
        name: 'name cate'
      },
      prices: [{
        name: 'ราคาปกติ',
        _type: 'normal',
        price: 50
      }],
      submenus: [{
        _type: 'one',
        name: 'เส้น',
        prices: [{
          name: 'ใหญ่',
          _type: 'normal',
          price: 0
        }]
      }],
      typebranch: 'ALL'
    };
    credentials = {
      username: 'username',
      password: 'password',
      firstName: 'first name',
      lastName: 'last name',
      email: 'test@email.com'
    };
    done();
  });

  it('should be signup get token for test ', function (done) {

    this.timeout(5000); // timeout bcrypt gennarate password 2~5s
    request(app)
      .post('/api/auth/signup')
      .send(credentials)
      .expect(200)
      .end(function (err, res) {
        if (err) {
          return done(err);
        }
        var resp = res.body;
        token = resp.token;
        assert.notEqual(resp.token, null);
        done();
      });

  });

  it('should be ' + _model + ' get', function (done) {

    request(app)
      .get('/api/' + _model)
      .expect(200)
      .end(function (err, res) {
        if (err) {
          return done(err);
        }
        var resp = res.body;
        assert.equal(resp.status, 200);
        assert.equal(resp.data.length, 0);
        done();
      });

  });

  it('should be ' + _model + ' get by id', function (done) {
    request(app)
      .post('/api/' + _model)
      .set('Authorization', 'Bearer ' + token)
      .send(item)
      .expect(200)
      .end(function (err, res) {
        if (err) {
          return done(err);
        }
        var resp = res.body;
        request(app)
          .get('/api/' + _model + '/' + resp.data._id)
          .expect(200)
          .end(function (err, res) {
            if (err) {
              return done(err);
            }
            var resp = res.body;
            assert.equal(resp.status, 200);
            assert.equal(resp.data.name, item.name);
            assert.equal(resp.data.image, item.image);
            done();
          });
      });

  });

  it('should be ' + _model + ' post use token', function (done) {

    request(app)
      .post('/api/' + _model)
      .set('Authorization', 'Bearer ' + token)
      .send(item)
      .expect(200)
      .end(function (err, res) {
        if (err) {
          return done(err);
        }
        var resp = res.body;
        assert.equal(resp.status, 200);
        assert.equal(resp.data.name, item.name);
        assert.equal(resp.data.image, item.image);
        done();
      });

  });

  it('should be ' + _model + ' put use token', function (done) {

    request(app)
      .post('/api/' + _model)
      .set('Authorization', 'Bearer ' + token)
      .send(item)
      .expect(200)
      .end(function (err, res) {
        if (err) {
          return done(err);
        }
        var resp = res.body;
        var update = {
          name: 'name update'
        }
        request(app)
          .put('/api/' + _model + '/' + resp.data._id)
          .set('Authorization', 'Bearer ' + token)
          .send(update)
          .expect(200)
          .end(function (err, res) {
            if (err) {
              return done(err);
            }
            var resp = res.body;
            assert.equal(resp.status, 200);
            assert.equal(resp.data.name, update.name);
            assert.equal(resp.data.image, item.image);
            done();
          });
      });

  });

  it('should be ' + _model + ' delete use token', function (done) {

    request(app)
      .post('/api/' + _model)
      .set('Authorization', 'Bearer ' + token)
      .send(item)
      .expect(200)
      .end(function (err, res) {
        if (err) {
          return done(err);
        }
        var resp = res.body;
        request(app)
          .delete('/api/' + _model + '/' + resp.data._id)
          .set('Authorization', 'Bearer ' + token)
          .expect(200)
          .end(done);
      });

  });

  it('should be ' + _model + ' post not use token', function (done) {

    request(app)
      .post('/api/' + _model)
      .send(item)
      .expect(403)
      .expect({
        message: 'User is not authorized'
      })
      .end(done);

  });

  it('should be ' + _model + ' put not use token', function (done) {

    request(app)
      .post('/api/' + _model)
      .set('Authorization', 'Bearer ' + token)
      .send(item)
      .expect(200)
      .end(function (err, res) {
        if (err) {
          return done(err);
        }
        var resp = res.body;
        var update = {
          name: 'name update'
        }
        request(app)
          .put('/api/' + _model + '/' + resp.data._id)
          .send(update)
          .expect(403)
          .expect({
            message: 'User is not authorized'
          })
          .end(done);
      });

  });

  it('should be ' + _model + ' delete not use token', function (done) {

    request(app)
      .post('/api/' + _model)
      .set('Authorization', 'Bearer ' + token)
      .send(item)
      .expect(200)
      .end(function (err, res) {
        if (err) {
          return done(err);
        }
        var resp = res.body;
        request(app)
          .delete('/api/' + _model + '/' + resp.data._id)
          .expect(403)
          .expect({
            message: 'User is not authorized'
          })
          .end(done);
      });

  });

  it('should be ' + _model + ' save if no name is provided (status 400)', function (done) {

    item.name = '';

    request(app)
      .post('/api/' + _model)
      .set('Authorization', 'Bearer ' + token)
      .send(item)
      .expect(400)
      .end(function (err, res) {
        assert.notEqual(res.body.message.indexOf('Please fill product name'), -1);
        done();
      });

  });

  it('should be ' + _model + ' save if no price is provided (status 400)', function (done) {

    item.name = 'name';
    item.prices = null;

    request(app)
      .post('/api/' + _model)
      .set('Authorization', 'Bearer ' + token)
      .send(item)
      .expect(400)
      .end(function (err, res) {
        assert.notEqual(res.body.message.indexOf('Please fill product price'), -1);
        done();
      });

  });


  afterEach(function (done) {
    User.remove().exec(function () {
      Model.remove().exec(done);
    });
  });

});