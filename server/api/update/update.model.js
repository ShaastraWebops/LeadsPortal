'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var autopopulate = require('mongoose-autopopulate');

var UpdateSchema = new Schema({
  deal: { type: Schema.Types.ObjectId, ref: 'Deal' },	
  pointOfContactName: String,
  pointOfContactNumber: String,
  pointOfContactEmail: String,
  title: String,
  summary: String,
  createdOn: Date,
  updatedOn: Date,
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', autopopulate: { select: 'name email phoneNumber rollNumber' } },
  lastEditedBy: { type: Schema.Types.ObjectId, ref: 'User', autopopulate: { select: 'name email phoneNumber rollNumber' } },
  nextActivityAim: String,
  nextActivityDate: Date
});

UpdateSchema.plugin(autopopulate);

module.exports = mongoose.model('Update', UpdateSchema);