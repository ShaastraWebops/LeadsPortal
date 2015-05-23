'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var DealSchema = new Schema({
  title: String,
  info: String,
  companyName: String,
  initialPointOfContactName: String,
  initialPointOfContactNumber: String,
  initialPointOfContactEmail: String,  
  assignees: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  updates: [{ type: Schema.Types.ObjectId, ref: 'Update' }],
  status: Boolean, // closed => 1, onGoing => 0
  result: Boolean, // success => 1, failure => 0
  createdOn: Date,
  updatedOn: Date,
  nextActiviy: {
  	aim: String,
  	date: Date
  }
});

module.exports = mongoose.model('Deal', DealSchema);