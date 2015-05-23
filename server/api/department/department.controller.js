'use strict';

var _ = require('lodash');
var Department = require('./department.model');

// Get list of departments
exports.index = function(req, res) {
  Department.find(function (err, departments){
    if(err) { return handleError(res, err); }
    return res.json(200, departments);
  })
  .populate('cores coords superCoords qms subDepartments');
};

// Get a single department
exports.show = function(req, res) {
  Department.findById(req.params.id, function (err, department) {
    if(err) { return handleError(res, err); }
    if(!department) { return res.send(404); }
    return res.json(department);
  })
  .populate('cores coords superCoords qms subDepartments');
};

// Creates a new department in the DB.
exports.create = function(req, res) {
  Department.create(req.body, function(err, department) {
    if(err) { return handleError(res, err); }
    return res.json(201, department);
  });
};

// Updates an existing department in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Department.findById(req.params.id, function (err, department) {
    if (err) { return handleError(res, err); }
    if(!department) { return res.send(404); }
    var updated = _.merge(department, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, department);
    });
  });
};

// Deletes a department from the DB.
exports.destroy = function(req, res) {
  Department.findById(req.params.id, function (err, department) {
    if(err) { return handleError(res, err); }
    if(!department) { return res.send(404); }
    department.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}