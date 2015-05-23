'use strict';

var _ = require('lodash');
var SubDepartment = require('./subDepartment.model');
var Department = require('../department/department.model');


// Get list of subDepartments
exports.index = function(req, res) {
  SubDepartment.find(function (err, subDepartments) {
    if(err) { return handleError(res, err); }
    return res.json(200, subDepartments);
  });
};

// Get a single subDepartment
exports.show = function(req, res) {
  SubDepartment.findById(req.params.id, function (err, subDepartment) {
    if(err) { return handleError(res, err); }
    if(!subDepartment) { return res.send(404); }
    return res.json(subDepartment);
  });
};

// Creates a new subDepartment in the DB.
exports.create = function(req, res) {
  SubDepartment.create(req.body, function(err, subDepartment) {
    if(err) { return handleError(res, err); }
    Department.findById(req.body.department, function (err, department) {
      if(err) { return handleError(res, err); }
      if(!department) { return res.send(404); }
      if(department.subDepartments.indexOf(subDepartment._id) == -1) {
        department.subDepartments.push(subDepartment._id);
        department.save(function (err) {
          if(err) { return handleError(res, err); }
          return res.json(201, subDepartment);
        });
      }
    });
  });
};

// Updates an existing subDepartment in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  SubDepartment.findById(req.params.id, function (err, subDepartment) {
    if (err) { return handleError(res, err); }
    if(!subDepartment) { return res.send(404); }
    var updated = _.merge(subDepartment, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, subDepartment);
    });
  });
};

// Deletes a subDepartment from the DB.
exports.destroy = function(req, res) {
  SubDepartment.findById(req.params.id, function (err, subDepartment) {
    if(err) { return handleError(res, err); }
    if(!subDepartment) { return res.send(404); }
    subDepartment.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}