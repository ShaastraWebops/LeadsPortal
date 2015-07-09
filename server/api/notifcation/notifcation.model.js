'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var NotifcationSchema = new Schema({
  name: String,
  info: String,
  active: Boolean
});

module.exports = mongoose.model('Notifcation', NotifcationSchema);