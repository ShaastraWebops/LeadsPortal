'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var deepPopulate = require('mongoose-deep-populate');

var NotifcationSchema = new Schema({
  name: String,
  info: String,
  deals: [{ type: Schema.Types.ObjectId, ref: 'Deal' }],
  updates: [{ type: Schema.Types.ObjectId, ref: 'Update' }]
});

NotifcationSchema.plugin(deepPopulate, {
  populate: {
    'updates.createdBy': {
      select: 'name rollNumber email phoneNumber'
    },
    'updates.lastEditedBy': {
      select: 'name rollNumber email phoneNumber'
    },
    'deals.createdBy': {
      select: 'name rollNumber email phoneNumber'
    },
    'deals.lastEditedBy': {
      select: 'name rollNumber email phoneNumber'
    }
  }	
});

module.exports = mongoose.model('Notifcation', NotifcationSchema);