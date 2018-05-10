'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Shop = mongoose.model('Shop');

/**
 * Globals
 */
var user,
  shop;

/**
 * Unit tests
 */
describe('Shop Model Unit Tests:', function () {
  beforeEach(function (done) {
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: 'username',
      password: 'password'
    });

    user.save(function () {
      shop = new Shop({
        shoptype: 'shoptype',
        foodtype: 'foodtype',
        name: 'Shop name',
        shopno: '0894447208',
        tel: '0894447208',
        address: '14/5',
        owner: 'owner',
        mobile: '0894445555',
        email: 'shopname@bitebite.com',
        code:'00001',
        branch: [{
          name: 'Shop Name by branch',
          tel: '0894447208',
          address: '14/5',
          owner: 'owner',
          mobile: '0894445555',
          email: 'shopnamebranch@bitebite.com'
        }],
        user: user
      });

      done();
    });
  });

  describe('Method Save', function () {
    it('should be able to save without problems', function (done) {
      this.timeout(0);
      return shop.save(function (err) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without shopno', function (done) {
      shop.shopno = '';

      return shop.save(function (err) {
        should.exist(err);
        done();
      });
    });
  });

  afterEach(function (done) {
    Shop.remove().exec(function () {
      User.remove().exec(function () {
        done();
      });
    });
  });
});
