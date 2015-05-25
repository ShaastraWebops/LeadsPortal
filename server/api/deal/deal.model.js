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

// Validate empty name
DealSchema
  .path('title')
  .validate(function(title) {
    return name.length;
  }, 'Name cannot be blank');

// Need a Gen info
DealSchema
  .path('info')
  .validate(function(info) {
    return info.length;
  }, 'info cannot be blank');

//CompanyName
DealSchema
  .path('companyName')
  .validate(function(cName) {
    return cName.length;
  }, 'Companyname cannot be blank');  

//Assignees
DealSchema
  .path('assignees')
  .validate(function(assign) {
    return assign.length;
  }, 'Should be assigned to someone');

module.exports = mongoose.model('Deal', DealSchema);