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
            shoptype: 'shoptype',
            foodtype: 'foodtype',
            shopno: '0894447208',
            name: '0894447208',
            tel: '0894447208',
            address: '14/5',
            owner: '0894447208',
            mobile: '0894445555',
            email: 'shopname@bitebite.com',
            code: '00001',
            branchs: [{
                name: 'Shop Name by branch',
                tel: '0894447208',
                address: '14/5',
            }]
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
                        assert.equal(resp.data.shoptype, item.shoptype);
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
                assert.equal(resp.data.shoptype, item.shoptype);
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
                    name: 'name update',
                    shoptype: 'shoptypeedit'
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
                        assert.equal(resp.data.shoptype, update.shoptype);
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

    afterEach(function (done) {
        User.remove().exec(function () {
            Model.remove().exec(done);
        });
    });

});
