'use strict';

var mongoose = require('mongoose');
var deepPopulate = require('mongoose-deep-populate');
var Schema = mongoose.Schema;

var allVerticals = [
                    'one',
                    'two',
                    'three',
                    'four'
                    ];

var DealSchema = new Schema({
  title: String,
  info: String,
  companyName: String,
  initialPointOfContactName: String,
  initialPointOfContactNumber: String,
  initialPointOfContactEmail: String,  
  assignees: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  updates: [{ type: Schema.Types.ObjectId, ref: 'Update' }],
  status: { type: Boolean, default: false },// closed => 1, onGoing => 0
  result: { type: Boolean, default: false }, // success => 1, failure => 0
  createdOn: Date,
  updatedOn: Date,
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  lastEditedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  vertical: { type: Schema.Types.ObjectId, ref: 'Vertical' },
  comment: String
});

DealSchema.plugin(deepPopulate, {
  whitelist: [
    'updates.createdBy',
    'updates.lastEditedBy'
  ],
  populate: {
    'updates.createdBy': {
      select: 'name rollNumber email phoneNumber'
    },
    'updates.lastEditedBy': {
      select: 'name rollNumber email phoneNumber'
    }
  }
});


// Validate empty name
DealSchema
  .path('title')
  .validate(function (title) {
    return title.length;
  }, 'Name cannot be blank');

// Need a Gen info
DealSchema
  .path('info')
  .validate(function (info) {
    return info.length;
  }, 'Info cannot be blank');

//CompanyName
DealSchema
  .path('companyName')
  .validate(function (cName) {
    return cName.length;
  }, 'Company Name cannot be blank');  

//Assignees
DealSchema
  .path('assignees')
  .validate(function (assign) {
    return assign.length;
  }, 'Should be assigned to someone');

  DealSchema
  .path('vertical')
  .validate(function (vertical) {
    return (allVerticals.indexOf(vertical.value) !== -1);
  }, 'This is not a valid vertical');


module.exports = mongoose.model('Deal', DealSchema);