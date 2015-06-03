'use strict';

var _ = require('lodash');
var SubDepartment = require('./subDepartment.model');
var Department = require('../department/department.model');


// Get list of subDepartments
exports.index = function(req, res) {
  SubDepartment.find(function (err, subDepartments) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(subDepartments);
  });
};

// Get a single subDepartment
exports.show = function(req, res) {
  SubDepartment.findById(req.params.id, function (err, subDepartment) {
    if(err) { return handleError(res, err); }
    if(!subDepartment) { return res.sendStatus(404); }
    return res.json(subDepartment);
  });
};

// Creates a new subDepartment in the DB.
exports.create = function(req, res) {
  SubDepartment.create(req.body, function(err, subDepartment) {
    if(err) { return handleError(res, err); }
    Department.findById(req.body.department, function (err, department) {
      if(err) { return handleError(res, err); }
      if(!department) { return res.sendStatus(404); }
      if(department.subDepartments.indexOf(subDepartment._id) == -1) {
        department.subDepartments.push(subDepartment._id);
        department.save(function (err) {
          if(err) { return handleError(res, err); }
          return res.status(201).json(subDepartment);
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
    if(!subDepartment) { return res.sendStatus(404); }
    var updated = _.merge(subDepartment, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(subDepartment);
    });
  });
};

// Deletes a subDepartment from the DB.
exports.destroy = function(req, res) {
  SubDepartment.findById(req.params.id, function (err, subDepartment) {
    if(err) { return handleError(res, err); }
    if(!subDepartment) { return res.sendStatus(404); }
    subDepartment.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.sendStatus(204);
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}