'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var SubDepartmentSchema = new Schema({
  name: String,
  info: String,
  calendar: String,
  folder: String,
  department: { type: Schema.Types.ObjectId, ref: 'Department' },
  cores: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  superCoords: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  coords: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  qms: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  canPost: {},
  createdOn: {
  	type: Date,
  	default: Date.now
  },
  updatedOn: {
  	type: Date,
  	default: Date.now
  }
});

/**
 * Validations
 */

// Validate empty sub-department name
SubDepartmentSchema
  .path('name')
  .validate(function(name) {
    if (authTypes.indexOf(this.provider) !== -1) return true;
    return name.length;
  }, 'Sub-Department name cannot be blank');

// Validate same name is not taken
SubDepartmentSchema
  .path('name')
  .validate(function(value, respond) {
    var self = this;
    this.constructor.findOne({name: value}, function(err, subDept) {
      if(err) throw err;
      if(subDept) {
        if(self.id === subDept.id) return respond(true);
        return respond(false);
      }
      respond(true);
    });
}, 'The specified sub-department name is already taken.');

module.exports = mongoose.model('SubDepartment', SubDepartmentSchema);