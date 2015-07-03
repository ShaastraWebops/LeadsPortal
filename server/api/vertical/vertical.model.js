'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
//title, description, createdBy, lastEditedBy, createdOn, updatedOn
var VerticalSchema = new Schema({	
  title: String,
  description: String,
  createdOn: Date,
  updatedOn: Date,
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  lastEditedBy: { type: Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Vertical', VerticalSchema);