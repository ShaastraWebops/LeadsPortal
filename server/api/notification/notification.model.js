'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var deepPopulate = require('mongoose-deep-populate');

var NotifcationSchema = new Schema({
  info: String,
  deal: { type: Schema.Types.ObjectId, ref: 'Deal' },
  update: { type: Schema.Types.ObjectId, ref: 'Update' }
});

NotifcationSchema.plugin(deepPopulate, {
  populate: {
    'update.createdBy': {
      select: 'name rollNumber email phoneNumber'
    },
    'update.lastEditedBy': {
      select: 'name rollNumber email phoneNumber'
    },
    'deal.createdBy': {
      select: 'name rollNumber email phoneNumber'
    },
    'deal.lastEditedBy': {
      select: 'name rollNumber email phoneNumber'
    }
  }	
});

module.exports = mongoose.model('Notifcation', NotifcationSchema);