/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var User = require('../api/user/user.model');
var Deal = require('../api/deal/deal.model');

User.find({}).remove(function() {
  User.create( 
  {
    provider: 'local',
    role: 'core',
    name: 'core1',
    email: 'core1@core.com',
    password: 'core',
    city: 'core1City',
    summerLocation: 'core1Summer',
    cgpa: '10',
    phoneNumber: '9999999999',
    rollNumber: 'aaaaaaaa'
  },
  {
    provider: 'local',
    role: 'core',
    name: 'core2',
    email: 'core2@core.com',
    password: 'core',
    city: 'core2City',
    summerLocation: 'core2Summer',
    cgpa: '10',
    phoneNumber: '9999999999',
    rollNumber: 'aaaaaaaa'
},
{
    provider: 'local',
    role: 'coord',
    name: 'coord1',
    email: 'coord1@coord.com',
    password: 'coord',
    city: 'coord1City',
    summerLocation: 'coord1Summer',
    cgpa: '10',
    phoneNumber: '9999999999',
    rollNumber: 'aaaaaaaa'
},
{
    provider: 'local',
    role: 'coord',
    name: 'coord2',
    email: 'coord2@coord.com',
    password: 'coord',
    city: 'coord2City',
    summerLocation: 'coord2Summer',
    cgpa: '10',
    phoneNumber: '9999999999',
    rollNumber: 'aaaaaaaa'
},
{
    provider: 'local',
    role: 'coord',
    name: 'coord3',
    email: 'coord3@coord.com',
    password: 'coord',
    city: 'coord3City',
    summerLocation: 'coord3Summer',
    cgpa: '10',
    phoneNumber: '9999999999',
    rollNumber: 'aaaaaaaa'
},
  function() {
      console.log('finished populating');
    }
  );
});