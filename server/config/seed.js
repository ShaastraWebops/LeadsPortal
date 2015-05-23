/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var User = require('../api/user/user.model');
var Deal = require('../api/deal/deal.model');

User.find({}).remove(function() {
  User.create({
    provider: 'local',
    name: 'Test User',
    email: 'test@test.com',
    password: 'test',
    city: 'testCity',
    summerLocation: 'testSummer',
    cgpa: '5',
    phoneNumber: '5555555555',
    rollNumber: 'tttttttt'
  }, {
    provider: 'local',
    role: 'admin',
    name: 'Admin',
    email: 'admin@admin.com',
    password: 'admin',
    city: 'adminCity',
    summerLocation: 'adminSummer',
    cgpa: '10',
    phoneNumber: '9999999999',
    rollNumber: 'aaaaaaaa'
  }, function() {
      console.log('finished populating');
    }
  );
});