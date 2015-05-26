'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var UpdateSchema = new Schema({
  assignees: { type: Schema.Types.ObjectId, ref: 'User' },
  deal: { type: Schema.Types.ObjectId, ref: 'Deal' },	
  pointOfContactName: String,
  pointOfContactNumber: String,
  pointOfContactEmail: String,
  title: String,
  summary: String,
  createdOn: Date,
  updatedOn: Date,
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  lastEditedBy: { type: Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Update', UpdateSchema);